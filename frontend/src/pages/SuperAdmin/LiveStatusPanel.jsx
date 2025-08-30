import React,
{
    useState,
    useEffect
}
from 'react';
import Pusher from 'pusher-js';
import {
    useAuth
}
from '../../context/AuthContext';
import {
    FiCircle,
    FiBriefcase,
    FiUserPlus,
    FiLogIn,
    FiPhone,
    FiMail,
    FiFileText,
    FiSettings,
    FiTrash2,
    FiEdit,
    FiUsers
}
from 'react-icons/fi';
import {
    motion,
    AnimatePresence
}
from 'framer-motion';
import {
    formatDistanceToNow
}
from 'date-fns';
import clsx from 'clsx';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

// --- NEW: Dynamic Icon, Color, and Message Formatting for Live Actions ---
const activityConfig = {
    JOB_CREATED: {
        icon: FiBriefcase,
        color: 'blue',
        text: 'Created a Job'
    },
    USER_APPROVED: {
        icon: FiUserPlus,
        color: 'green',
        text: 'Approved a User'
    },
    USER_LOGIN_SUCCESS: {
        icon: FiLogIn,
        color: 'gray',
        text: 'Logged In'
    },
    CALL_LOGGED: {
        icon: FiPhone,
        color: 'purple',
        text: 'Logged a Call'
    },
    EMAIL_QUEUED: {
        icon: FiMail,
        color: 'indigo',
        text: 'Sent an Email'
    },
    REPORT_SUBMITTED: {
        icon: FiFileText,
        color: 'yellow',
        text: 'Submitted Report'
    },
    Online: {
        icon: FiCircle,
        color: 'green',
        text: 'Online'
    },
    'Just joined': {
        icon: FiLogIn,
        color: 'green',
        text: 'Just Joined'
    },
    DEFAULT: {
        icon: FiCircle,
        color: 'green',
        text: 'Online'
    },
};

const iconColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    gray: 'text-gray-500',
    purple: 'text-purple-500',
    indigo: 'text-indigo-500',
    yellow: 'text-yellow-500',
};

function LiveStatusPanel() {
    const [onlineUsers, setOnlineUsers] = useState(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const {
        user
    } = useAuth();

    useEffect(() => {
        if (!user) return;

        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
            authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/pusher/auth`,
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            },
        });

        const presenceChannel = pusher.subscribe('presence-hrms-monitoring');

        const updateUserList = (members) => {
            const usersMap = new Map();
            members.each(member => {
                // Don't show the current Super Admin in the list
                if (member.id !== user._id) {
                    usersMap.set(member.id, {
                        ...member.info,
                        lastAction: 'Online',
                        timestamp: new Date()
                    });
                }
            });
            setOnlineUsers(usersMap);
            setIsLoading(false);
        };

        presenceChannel.bind('pusher:subscription_succeeded', updateUserList);
        presenceChannel.bind('pusher:subscription_error', () => {
            setIsLoading(false);
            console.error("Pusher subscription failed. Check auth endpoint and credentials.");
        });

        presenceChannel.bind('pusher:member_added', (member) => {
            setOnlineUsers(prevMap => new Map(prevMap).set(member.id, {
                ...member.info,
                lastAction: 'Just joined',
                timestamp: new Date()
            }));
        });

        presenceChannel.bind('pusher:member_removed', (member) => {
            setOnlineUsers(prevMap => {
                const newMap = new Map(prevMap);
                newMap.delete(member.id);
                return newMap;
            });
        });

        presenceChannel.bind('user-activity', (data) => {
            setOnlineUsers(prevMap => {
                const newMap = new Map(prevMap);
                const userToUpdate = newMap.get(data.userId);
                if (userToUpdate) {
                    newMap.set(data.userId, {
                        ...userToUpdate,
                        lastAction: data.action,
                        timestamp: data.timestamp
                    });
                }
                return newMap;
            });
        });

        return () => {
            pusher.unsubscribe('presence-hrms-monitoring');
        };
    }, [user]);

    const usersArray = Array.from(onlineUsers.values());

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-full"><LoadingSpinner text="Connecting to live feed..." /></div>;
        }
        if (usersArray.length === 0) {
            return (
                <div className="text-center py-12">
                    <FiUsers className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">No Other Users Online</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">You're the only one here right now.</p>
                </div>
            );
        }
        return (
            <ul className="space-y-3 h-96 overflow-y-auto pr-2">
                <AnimatePresence>
                    {usersArray.map((onlineUser) => {
                        const config = activityConfig[onlineUser.lastAction] || activityConfig.DEFAULT;
                        const Icon = config.icon;
                        return (
                            <motion.li
                                key={onlineUser.name}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-green-dark rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                        {onlineUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{onlineUser.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{onlineUser.role.replace('-', ' ').toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold truncate max-w-[150px]" title={config.text}>
                                    <Icon className={clsx("h-4 w-4", iconColors[config.color])} />
                                    <span className={clsx("truncate", iconColors[config.color])}>
                                        {config.text}
                                    </span>
                                </div>
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </ul>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Live User Status</h3>
            {renderContent()}
        </div>
    );
}

export default LiveStatusPanel;
