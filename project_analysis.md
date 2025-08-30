# Project Deep Analysis Report
**Root:** `C:\Dev\Akshya Patra Services Final\akshya-patra-services`
**Scanned files:** 106
**Code files parsed:** 97

---
## 1) package.json summary
- package.json 
  - no scripts found
- frontend/package.json (aps-frontend)
  - script: `dev` -> "vite"
  - script: `build` -> "vite build"
  - script: `lint` -> "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  - script: `preview` -> "vite preview"
  - script: `format` -> "prettier --write "src/**/*.{js,jsx}""
  - script: `test` -> "vitest"
- backend/package.json (aps-backend)
  - script: `start` -> "node src/server.js"
  - script: `dev` -> "nodemon src/server.js"
  - script: `lint` -> "eslint . --ext .js"

---
## 2) File tree (all scanned files)
```
deep_analyzer.js
package-lock.json
package.json
project_analyzer.js
backend\package-lock.json
backend\package.json
frontend\index.html
frontend\package-lock.json
frontend\package.json
frontend\postcss.config.js
frontend\tailwind.config.js
frontend\vite.config.js
backend\src\server.js
frontend\public\manifest.json
frontend\src\App.jsx
frontend\src\main.jsx
backend\src\config\db.js
backend\src\config\index.js
backend\src\config\passport.js
backend\src\controllers\activityLogController.js
backend\src\controllers\authController.js
backend\src\controllers\callLogController.js
backend\src\controllers\candidateController.js
backend\src\controllers\dailyReportController.js
backend\src\controllers\dashboardController.js
backend\src\controllers\designationController.js
backend\src\controllers\emailLogController.js
backend\src\controllers\jobController.js
backend\src\controllers\noteController.js
backend\src\controllers\pusherController.js
backend\src\controllers\sectorController.js
backend\src\controllers\settingsController.js
backend\src\controllers\userController.js
backend\src\middleware\authMiddleware.js
backend\src\middleware\errorMiddleware.js
backend\src\models\ActivityLog.js
backend\src\models\CallLog.js
backend\src\models\Candidate.js
backend\src\models\DailyReport.js
backend\src\models\Designation.js
backend\src\models\EmailLog.js
backend\src\models\Job.js
backend\src\models\Note.js
backend\src\models\Sector.js
backend\src\models\Settings.js
backend\src\models\User.js
backend\src\routes\activityLogRoutes.js
backend\src\routes\authRoutes.js
backend\src\routes\callLogRoutes.js
backend\src\routes\candidateRoutes.js
backend\src\routes\dailyReportRoutes.js
backend\src\routes\dashboardRoutes.js
backend\src\routes\designationRoutes.js
backend\src\routes\emailLogRoutes.js
backend\src\routes\jobRoutes.js
backend\src\routes\noteRoutes.js
backend\src\routes\pusherRoutes.js
backend\src\routes\sectorRoutes.js
backend\src\routes\settingsRoutes.js
backend\src\routes\userRoutes.js
backend\src\services\activityLogService.js
backend\src\services\emailService.js
backend\src\services\resumeParserService.js
frontend\src\context\AuthContext.jsx
frontend\src\layouts\AdminLayout.jsx
frontend\src\layouts\CandidateLayout.jsx
frontend\src\layouts\HRLayout.jsx
frontend\src\layouts\SuperAdminLayout.jsx
frontend\src\lib\api.js
frontend\src\routes\AppRoutes.jsx
frontend\src\routes\ProtectedRoute.jsx
frontend\src\store\useUIStore.js
frontend\src\styles\index.css
frontend\src\components\Candidate\JobListing.jsx
frontend\src\components\Common\Header.jsx
frontend\src\components\Common\LoadingSpinner.jsx
frontend\src\components\Common\Sidebar.jsx
frontend\src\components\Dashboard\DashboardChart.jsx
frontend\src\components\Dashboard\RecentActivity.jsx
frontend\src\components\Dashboard\StatCard.jsx
frontend\src\components\HR\LogCallModal.jsx
frontend\src\components\HR\ResumeUpload.jsx
frontend\src\components\HR\SendEmailModal.jsx
frontend\src\pages\Admin\AdminCreateJobPage.jsx
frontend\src\pages\Admin\AdminDashboardPage.jsx
frontend\src\pages\Admin\AdminHrManagementPage.jsx
frontend\src\pages\Admin\AdminManageDesignationsPage.jsx
frontend\src\pages\Admin\AdminManageJobsPage.jsx
frontend\src\pages\Admin\AdminManageSectorsPage.jsx
frontend\src\pages\Admin\AdminViewReportsPage.jsx
frontend\src\pages\Candidate\CandidateApplyPage.jsx
frontend\src\pages\Candidate\CandidateHomePage.jsx
frontend\src\pages\HR\HRCandidateDetailsPage.jsx
frontend\src\pages\HR\HRCandidatesPage.jsx
frontend\src\pages\HR\HRCreateJobPage.jsx
frontend\src\pages\HR\HRDashboardPage.jsx
frontend\src\pages\HR\HRReviewQueuePage.jsx
frontend\src\pages\HR\HRSubmitReportPage.jsx
frontend\src\pages\SuperAdmin\LiveStatusPanel.jsx
frontend\src\pages\SuperAdmin\SuperAdminDashboardPage.jsx
frontend\src\pages\SuperAdmin\SuperAdminSettingsPage.jsx
frontend\src\pages\SuperAdmin\SuperAdminUserManagementPage.jsx
frontend\src\pages\Shared\ActivityLogPage.jsx
frontend\src\pages\Shared\AuthSuccessPage.jsx
frontend\src\pages\Shared\LoginPage.jsx
frontend\src\pages\Shared\NotFoundPage.jsx
```

---
## 3) Per-file summary (lines, imports, parse errors)
### deep_analyzer.js
- Lines: 474
- requires: "fs", "path", "child_process", "fast-glob", "@babel/parser", "@babel/traverse", "axios", "chalk"
- detected route calls (4):
  - method: delete path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)

### package-lock.json
- Lines: 790

### package.json
- Lines: 10

### project_analyzer.js
- Lines: 145
- requires: "fs", "path"

### backend\package-lock.json
- Lines: 3347

### backend\package.json
- Lines: 34

### frontend\index.html
- Lines: 30

### frontend\package-lock.json
- Lines: 7653

### frontend\package.json
- Lines: 53

### frontend\postcss.config.js
- Lines: 7
- exports: default

### frontend\tailwind.config.js
- Lines: 68
- import statements:
  - from `@tailwindcss/forms` — default:forms
  - from `@tailwindcss/typography` — default:typography
- exports: default

### frontend\vite.config.js
- Lines: 22
- import statements:
  - from `vite` — named:defineConfig(defineConfig)
  - from `@vitejs/plugin-react` — default:react
- exports: default

### backend\src\server.js
- Lines: 99
- import statements:
  - from `express` — default:express
  - from `dotenv` — default:dotenv
  - from `cors` — default:cors
  - from `passport` — default:passport
  - from `path` — default:path
  - from `url` — named:fileURLToPath(fileURLToPath)
  - from `chalk` — default:chalk
  - from `./config/db.js` — default:connectDB
  - from `./config/passport.js` — default:configurePassport
  - from `./routes/authRoutes.js` — default:authRoutes
  - from `./routes/candidateRoutes.js` — default:candidateRoutes
  - from `./routes/jobRoutes.js` — default:jobRoutes
  - from `./routes/dashboardRoutes.js` — default:dashboardRoutes
  - from `./routes/callLogRoutes.js` — default:callLogRoutes
  - from `./routes/emailLogRoutes.js` — default:emailLogRoutes
  - from `./routes/noteRoutes.js` — default:noteRoutes
  - from `./routes/dailyReportRoutes.js` — default:dailyReportRoutes
  - from `./routes/sectorRoutes.js` — default:sectorRoutes
  - from `./routes/designationRoutes.js` — default:designationRoutes
  - from `./routes/userRoutes.js` — default:userRoutes
  - from `./routes/settingsRoutes.js` — default:settingsRoutes
  - from `./routes/activityLogRoutes.js` — default:activityLogRoutes
  - from `./routes/pusherRoutes.js` — default:pusherRoutes
  - from `./middleware/errorMiddleware.js` — named:notFound(notFound), named:errorHandler(errorHandler)
- detected route calls (21):
  - method: use path: (dynamic/unknown)
  - method: use path: (dynamic/unknown)
  - method: use path: (dynamic/unknown)
  - method: use path: (dynamic/unknown)
  - method: use path: /api/auth
  - method: use path: /api/candidates
  - method: use path: /api/jobs
  - method: use path: /api/dashboard
  - method: use path: /api/call-logs
  - method: use path: /api/emails
  - method: use path: /api/notes
  - method: use path: /api/reports
  - method: use path: /api/sectors
  - method: use path: /api/designations
  - method: use path: /api/users
  - method: use path: /api/settings
  - method: use path: /api/activity-logs
  - method: use path: /api/pusher
  - method: use path: /uploads
  - method: use path: (dynamic/unknown)
  - method: use path: (dynamic/unknown)

### frontend\public\manifest.json
- Lines: 1

### frontend\src\App.jsx
- Lines: 84
- import statements:
  - from `react` — default:React, named:useEffect(useEffect)
  - from `react-hot-toast` — named:Toaster(Toaster)
  - from `./routes/AppRoutes` — default:AppRoutes
  - from `./store/useUIStore` — default:useUIStore
- exports: default

### frontend\src\main.jsx
- Lines: 27
- import statements:
  - from `react` — default:React
  - from `react-dom/client` — default:ReactDOM
  - from `react-router-dom` — named:BrowserRouter(BrowserRouter)
  - from `./App.jsx` — default:App
  - from `./context/AuthContext` — named:AuthProvider(AuthProvider)
  - from `./styles/index.css` — (no specifiers)

### backend\src\config\db.js
- Lines: 33
- import statements:
  - from `mongoose` — default:mongoose
  - from `chalk` — default:chalk
- exports: default

### backend\src\config\index.js
- Lines: 1

### backend\src\config\passport.js
- Lines: 87
- import statements:
  - from `passport-google-oauth20` — named:GoogleStrategy(Strategy)
  - from `../models/User.js` — default:User
  - from `../services/emailService.js` — default:sendEmail
  - from `chalk` — default:chalk
- exports: default
- detected route calls (1):
  - method: use path: (dynamic/unknown)

### backend\src\controllers\activityLogController.js
- Lines: 32
- import statements:
  - from `../models/ActivityLog.js` — default:ActivityLog
  - from `chalk` — default:chalk
- exports: getAllActivityLogs

### backend\src\controllers\authController.js
- Lines: 112
- import statements:
  - from `../models/User.js` — default:User
  - from `jsonwebtoken` — default:jwt
  - from `bcryptjs` — default:bcryptjs
  - from `chalk` — default:chalk
  - from `../services/activityLogService.js` — named:logActivity(logActivity)
- exports: registerUser, loginUser, googleAuthSuccess, getMe

### backend\src\controllers\callLogController.js
- Lines: 67
- import statements:
  - from `../models/CallLog.js` — default:CallLog
  - from `../models/Candidate.js` — default:Candidate
  - from `../services/activityLogService.js` — named:logActivity(logActivity)
  - from `chalk` — default:chalk
- exports: createCallLog, getCallLogsForCandidate

### backend\src\controllers\candidateController.js
- Lines: 206
- import statements:
  - from `../models/Candidate.js` — default:Candidate
  - from `../services/activityLogService.js` — named:logActivity(logActivity)
  - from `../services/resumeParserService.js` — named:parseResume(parseResume)
  - from `chalk` — default:chalk
- exports: createCandidate, createCandidateFromHR, getAllCandidates, getReviewQueueCandidates, getCandidateById, updateCandidateStatus

### backend\src\controllers\dailyReportController.js
- Lines: 121
- import statements:
  - from `../models/DailyReport.js` — default:DailyReport
  - from `../services/activityLogService.js` — named:logActivity(logActivity)
  - from `chalk` — default:chalk
- exports: submitDailyReport, getAllDailyReports, updateReportStatus

### backend\src\controllers\dashboardController.js
- Lines: 54
- import statements:
  - from `../models/Candidate.js` — default:Candidate
  - from `../models/Job.js` — default:Job
  - from `../models/User.js` — default:User
  - from `chalk` — default:chalk
- exports: getDashboardStats

### backend\src\controllers\designationController.js
- Lines: 69
- import statements:
  - from `../models/Designation.js` — default:Designation
  - from `../models/Sector.js` — default:Sector
  - from `../services/activityLogService.js` — named:logActivity(logActivity)
  - from `chalk` — default:chalk
- exports: createDesignation, getAllDesignations

### backend\src\controllers\emailLogController.js
- Lines: 87
- import statements:
  - from `../models/EmailLog.js` — default:EmailLog
  - from `../models/Candidate.js` — default:Candidate
  - from `../services/emailService.js` — default:sendEmail
  - from `../services/activityLogService.js` — named:logActivity(logActivity)
  - from `chalk` — default:chalk
- exports: sendAndLogEmail, getEmailLogsForCandidate

### backend\src\controllers\jobController.js
- Lines: 147
- import statements:
  - from `../models/Job.js` — default:Job
  - from `../services/activityLogService.js` — named:logActivity(logActivity)
  - from `chalk` — default:chalk
- exports: createJob, getAllJobs, getJobsForAdmin, updateJob, deleteJob

### backend\src\controllers\noteController.js
- Lines: 65
- import statements:
  - from `../models/Note.js` — default:Note
  - from `../models/Candidate.js` — default:Candidate
  - from `../services/activityLogService.js` — named:logActivity(logActivity)
  - from `chalk` — default:chalk
- exports: createNote, getNotesForCandidate

### backend\src\controllers\pusherController.js
- Lines: 49
- import statements:
  - from `pusher` — default:Pusher
  - from `chalk` — default:chalk
- exports: authenticateUser

### backend\src\controllers\sectorController.js
- Lines: 73
- import statements:
  - from `../models/Sector.js` — default:Sector
  - from `../services/activityLogService.js` — named:logActivity(logActivity)
  - from `chalk` — default:chalk
- exports: createSector, getAllSectors

### backend\src\controllers\settingsController.js
- Lines: 61
- import statements:
  - from `../models/Settings.js` — default:Settings
  - from `../services/activityLogService.js` — named:logActivity(logActivity)
  - from `chalk` — default:chalk
- exports: getSettings, updateSettings

### backend\src\controllers\userController.js
- Lines: 203
- import statements:
  - from `../models/User.js` — default:User
  - from `../services/activityLogService.js` — named:logActivity(logActivity)
  - from `../services/emailService.js` — default:sendEmail
  - from `chalk` — default:chalk
- exports: getAllUsers, getHrUsers, approveUser, rejectUser, updateUser, deleteUser

### backend\src\middleware\authMiddleware.js
- Lines: 73
- import statements:
  - from `jsonwebtoken` — default:jwt
  - from `../models/User.js` — default:User
  - from `chalk` — default:chalk
- exports: protect, recruiter, hrManager, admin, superAdmin

### backend\src\middleware\errorMiddleware.js
- Lines: 41
- import statements:
  - from `chalk` — default:chalk
- exports: notFound, errorHandler

### backend\src\models\ActivityLog.js
- Lines: 29
- import statements:
  - from `mongoose` — default:mongoose
- exports: default

### backend\src\models\CallLog.js
- Lines: 42
- import statements:
  - from `mongoose` — default:mongoose
- exports: default

### backend\src\models\Candidate.js
- Lines: 73
- import statements:
  - from `mongoose` — default:mongoose
- exports: default

### backend\src\models\DailyReport.js
- Lines: 60
- import statements:
  - from `mongoose` — default:mongoose
- exports: default

### backend\src\models\Designation.js
- Lines: 35
- import statements:
  - from `mongoose` — default:mongoose
- exports: default

### backend\src\models\EmailLog.js
- Lines: 45
- import statements:
  - from `mongoose` — default:mongoose
- exports: default

### backend\src\models\Job.js
- Lines: 56
- import statements:
  - from `mongoose` — default:mongoose
- exports: default

### backend\src\models\Note.js
- Lines: 34
- import statements:
  - from `mongoose` — default:mongoose
- exports: default

### backend\src\models\Sector.js
- Lines: 30
- import statements:
  - from `mongoose` — default:mongoose
- exports: default

### backend\src\models\Settings.js
- Lines: 33
- import statements:
  - from `mongoose` — default:mongoose
- exports: default

### backend\src\models\User.js
- Lines: 72
- import statements:
  - from `mongoose` — default:mongoose
  - from `bcryptjs` — default:bcryptjs
- exports: default

### backend\src\routes\activityLogRoutes.js
- Lines: 13
- import statements:
  - from `express` — default:express
  - from `../controllers/activityLogController.js` — named:getAllActivityLogs(getAllActivityLogs)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:admin(admin)
- exports: default
- detected route calls (1):
  - method: get path: /

### backend\src\routes\authRoutes.js
- Lines: 36
- import statements:
  - from `express` — default:express
  - from `passport` — default:passport
  - from `../controllers/authController.js` — named:registerUser(registerUser), named:loginUser(loginUser), named:googleAuthSuccess(googleAuthSuccess), named:getMe(getMe)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:admin(admin)
- exports: default
- detected route calls (6):
  - method: post path: /register
  - method: post path: /login
  - method: get path: /me
  - method: get path: /google
  - method: get path: /google/callback
  - method: get path: /success

### backend\src\routes\callLogRoutes.js
- Lines: 15
- import statements:
  - from `express` — default:express
  - from `../controllers/callLogController.js` — named:createCallLog(createCallLog), named:getCallLogsForCandidate(getCallLogsForCandidate)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:hrManager(hrManager)
- exports: default
- detected route calls (2):
  - method: post path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)

### backend\src\routes\candidateRoutes.js
- Lines: 45
- import statements:
  - from `express` — default:express
  - from `../controllers/candidateController.js` — named:createCandidate(createCandidate), named:getAllCandidates(getAllCandidates), named:getCandidateById(getCandidateById), named:updateCandidateStatus(updateCandidateStatus), named:createCandidateFromHR(createCandidateFromHR), named:getReviewQueueCandidates(getReviewQueueCandidates)
  - from `multer` — default:multer
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:recruiter(recruiter)
- exports: default
- detected route calls (7):
  - method: post path: /apply
  - method: post path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: put path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: put path: (dynamic/unknown)

### backend\src\routes\dailyReportRoutes.js
- Lines: 20
- import statements:
  - from `express` — default:express
  - from `../controllers/dailyReportController.js` — named:submitDailyReport(submitDailyReport), named:getAllDailyReports(getAllDailyReports), named:updateReportStatus(updateReportStatus)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:hrManager(hrManager), named:admin(admin)
- exports: default
- detected route calls (3):
  - method: get path: (dynamic/unknown)
  - method: post path: (dynamic/unknown)
  - method: put path: (dynamic/unknown)

### backend\src\routes\dashboardRoutes.js
- Lines: 11
- import statements:
  - from `express` — default:express
  - from `../controllers/dashboardController.js` — named:getDashboardStats(getDashboardStats)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:hrManager(hrManager)
- exports: default
- detected route calls (1):
  - method: get path: (dynamic/unknown)

### backend\src\routes\designationRoutes.js
- Lines: 15
- import statements:
  - from `express` — default:express
  - from `../controllers/designationController.js` — named:createDesignation(createDesignation), named:getAllDesignations(getAllDesignations)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:admin(admin)
- exports: default
- detected route calls (2):
  - method: post path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)

### backend\src\routes\emailLogRoutes.js
- Lines: 15
- import statements:
  - from `express` — default:express
  - from `../controllers/emailLogController.js` — named:sendAndLogEmail(sendAndLogEmail), named:getEmailLogsForCandidate(getEmailLogsForCandidate)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:hrManager(hrManager)
- exports: default
- detected route calls (2):
  - method: post path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)

### backend\src\routes\jobRoutes.js
- Lines: 24
- import statements:
  - from `express` — default:express
  - from `../controllers/jobController.js` — named:createJob(createJob), named:getAllJobs(getAllJobs), named:getJobsForAdmin(getJobsForAdmin), named:updateJob(updateJob), named:deleteJob(deleteJob)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:admin(admin)
- exports: default
- detected route calls (5):
  - method: post path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: delete path: (dynamic/unknown)
  - method: put path: (dynamic/unknown)

### backend\src\routes\noteRoutes.js
- Lines: 15
- import statements:
  - from `express` — default:express
  - from `../controllers/noteController.js` — named:createNote(createNote), named:getNotesForCandidate(getNotesForCandidate)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:hrManager(hrManager)
- exports: default
- detected route calls (2):
  - method: post path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)

### backend\src\routes\pusherRoutes.js
- Lines: 13
- import statements:
  - from `express` — default:express
  - from `../controllers/pusherController.js` — named:authenticateUser(authenticateUser)
  - from `../middleware/authMiddleware.js` — named:protect(protect)
- exports: default
- detected route calls (1):
  - method: post path: /auth

### backend\src\routes\sectorRoutes.js
- Lines: 15
- import statements:
  - from `express` — default:express
  - from `../controllers/sectorController.js` — named:createSector(createSector), named:getAllSectors(getAllSectors)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:admin(admin)
- exports: default
- detected route calls (2):
  - method: post path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)

### backend\src\routes\settingsRoutes.js
- Lines: 14
- import statements:
  - from `express` — default:express
  - from `../controllers/settingsController.js` — named:getSettings(getSettings), named:updateSettings(updateSettings)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:superAdmin(superAdmin)
- exports: default
- detected route calls (2):
  - method: put path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)

### backend\src\routes\userRoutes.js
- Lines: 33
- import statements:
  - from `express` — default:express
  - from `../controllers/userController.js` — named:getAllUsers(getAllUsers), named:getHrUsers(getHrUsers), named:deleteUser(deleteUser), named:updateUser(updateUser), named:approveUser(approveUser), named:rejectUser(rejectUser)
  - from `../middleware/authMiddleware.js` — named:protect(protect), named:admin(admin), named:superAdmin(superAdmin)
- exports: default
- detected route calls (6):
  - method: get path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: delete path: (dynamic/unknown)
  - method: put path: (dynamic/unknown)
  - method: put path: (dynamic/unknown)
  - method: put path: (dynamic/unknown)

### backend\src\services\activityLogService.js
- Lines: 46
- import statements:
  - from `../models/ActivityLog.js` — default:ActivityLog
  - from `pusher` — default:Pusher
  - from `chalk` — default:chalk
- exports: logActivity

### backend\src\services\emailService.js
- Lines: 118
- import statements:
  - from `nodemailer` — default:nodemailer
  - from `chalk` — default:chalk
- exports: default

### backend\src\services\resumeParserService.js
- Lines: 112
- import statements:
  - from `fs` — default:fs
  - from `pdf2json` — default:PDFParser
  - from `chalk` — default:chalk
- exports: parseResume

### frontend\src\context\AuthContext.jsx
- Lines: 135
- import statements:
  - from `react` — default:React, named:createContext(createContext), named:useContext(useContext), named:useEffect(useEffect), named:useReducer(useReducer)
  - from `react-router-dom` — named:useNavigate(useNavigate)
  - from `react-hot-toast` — default:toast
  - from `jwt-decode` — named:jwtDecode(jwtDecode)
  - from `../lib/api` — default:api
- exports: AuthProvider, useAuth
- detected route calls (3):
  - method: get path: /auth/me
  - method: post path: /auth/login
  - method: get path: /auth/me

### frontend\src\layouts\AdminLayout.jsx
- Lines: 53
- import statements:
  - from `react` — default:React
  - from `react-router-dom` — named:Outlet(Outlet), named:useLocation(useLocation)
  - from `../components/Common/Sidebar` — default:Sidebar
  - from `../components/Common/Header` — default:Header
  - from `framer-motion` — named:motion(motion)
- exports: default

### frontend\src\layouts\CandidateLayout.jsx
- Lines: 70
- import statements:
  - from `react` — default:React, named:useEffect(useEffect)
  - from `react-router-dom` — named:Outlet(Outlet), named:Link(Link)
  - from `framer-motion` — named:motion(motion)
- exports: default

### frontend\src\layouts\HRLayout.jsx
- Lines: 40
- import statements:
  - from `react` — default:React
  - from `react-router-dom` — named:Outlet(Outlet)
  - from `../components/Common/Sidebar` — default:Sidebar
  - from `../components/Common/Header` — default:Header
  - from `framer-motion` — named:motion(motion)
- exports: default

### frontend\src\layouts\SuperAdminLayout.jsx
- Lines: 48
- import statements:
  - from `react` — default:React
  - from `react-router-dom` — named:Outlet(Outlet), named:useLocation(useLocation)
  - from `../components/Common/Sidebar` — default:Sidebar
  - from `../components/Common/Header` — default:Header
  - from `framer-motion` — named:motion(motion)
- exports: default

### frontend\src\lib\api.js
- Lines: 63
- import statements:
  - from `axios` — default:axios
  - from `react-hot-toast` — default:toast
- exports: default
- detected route calls (2):
  - method: use path: (dynamic/unknown)
  - method: use path: (dynamic/unknown)

### frontend\src\routes\AppRoutes.jsx
- Lines: 112
- import statements:
  - from `react` — default:React
  - from `react-router-dom` — named:Routes(Routes), named:Route(Route), named:Navigate(Navigate), named:useLocation(useLocation)
  - from `framer-motion` — named:AnimatePresence(AnimatePresence)
  - from `../layouts/AdminLayout` — default:AdminLayout
  - from `../layouts/CandidateLayout` — default:CandidateLayout
  - from `../layouts/HRLayout` — default:HRLayout
  - from `../layouts/SuperAdminLayout` — default:SuperAdminLayout
  - from `./ProtectedRoute` — default:ProtectedRoute
  - from `../pages/Admin/AdminCreateJobPage` — default:AdminCreateJobPage
  - from `../pages/Admin/AdminDashboardPage` — default:AdminDashboardPage
  - from `../pages/Admin/AdminHrManagementPage` — default:AdminHrManagementPage
  - from `../pages/Admin/AdminManageDesignationsPage` — default:AdminManageDesignationsPage
  - from `../pages/Admin/AdminManageJobsPage` — default:AdminManageJobsPage
  - from `../pages/Admin/AdminManageSectorsPage` — default:AdminManageSectorsPage
  - from `../pages/Admin/AdminViewReportsPage` — default:AdminViewReportsPage
  - from `../pages/Candidate/CandidateApplyPage` — default:CandidateApplyPage
  - from `../pages/Candidate/CandidateHomePage` — default:CandidateHomePage
  - from `../pages/HR/HRCandidateDetailsPage` — default:HRCandidateDetailsPage
  - from `../pages/HR/HRCandidatesPage` — default:HRCandidatesPage
  - from `../pages/HR/HRCreateJobPage` — default:HRCreateJobPage
  - from `../pages/HR/HRDashboardPage` — default:HRDashboardPage
  - from `../pages/HR/HRReviewQueuePage` — default:HRReviewQueuePage
  - from `../pages/HR/HRSubmitReportPage` — default:HRSubmitReportPage
  - from `../pages/Shared/ActivityLogPage` — default:ActivityLogPage
  - from `../pages/Shared/AuthSuccessPage` — default:AuthSuccessPage
  - from `../pages/Shared/LoginPage` — default:LoginPage
  - from `../pages/Shared/NotFoundPage` — default:NotFoundPage
  - from `../pages/SuperAdmin/SuperAdminDashboardPage` — default:SuperAdminDashboardPage
  - from `../pages/SuperAdmin/SuperAdminSettingsPage` — default:SuperAdminSettingsPage
  - from `../pages/SuperAdmin/SuperAdminUserManagementPage` — default:SuperAdminUserManagementPage
- exports: default

### frontend\src\routes\ProtectedRoute.jsx
- Lines: 56
- import statements:
  - from `react` — default:React, named:useEffect(useEffect)
  - from `react-router-dom` — named:Navigate(Navigate), named:Outlet(Outlet)
  - from `../context/AuthContext` — named:useAuth(useAuth)
  - from `framer-motion` — named:motion(motion)
  - from `../components/Common/LoadingSpinner` — default:LoadingSpinner
- exports: default

### frontend\src\store\useUIStore.js
- Lines: 59
- import statements:
  - from `zustand` — named:create(create)
- exports: default

### frontend\src\styles\index.css
- Lines: 22

### frontend\src\components\Candidate\JobListing.jsx
- Lines: 59
- import statements:
  - from `react` — default:React
  - from `react-router-dom` — named:Link(Link)
  - from `react-icons/fi` — named:FiMapPin(FiMapPin), named:FiDollarSign(FiDollarSign), named:FiBriefcase(FiBriefcase)
  - from `framer-motion` — named:motion(motion)
- exports: default

### frontend\src\components\Common\Header.jsx
- Lines: 125
- import statements:
  - from `react` — default:React, named:useState(useState), named:useRef(useRef), named:useEffect(useEffect)
  - from `react-icons/fi` — named:FiBell(FiBell), named:FiLogOut(FiLogOut), named:FiMenu(FiMenu), named:FiChevronDown(FiChevronDown), named:FiMoon(FiMoon), named:FiSun(FiSun)
  - from `../../context/AuthContext` — named:useAuth(useAuth)
  - from `../../store/useUIStore` — default:useUIStore
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
  - from `react-hot-toast` — default:toast
- exports: default

### frontend\src\components\Common\LoadingSpinner.jsx
- Lines: 42
- import statements:
  - from `react` — default:React
  - from `framer-motion` — named:motion(motion)
- exports: default

### frontend\src\components\Common\Sidebar.jsx
- Lines: 155
- import statements:
  - from `react` — default:React
  - from `react-router-dom` — named:NavLink(NavLink)
  - from `react-icons/fi` — named:FiGrid(FiGrid), named:FiActivity(FiActivity), named:FiSettings(FiSettings), named:FiUsers(FiUsers), named:FiShield(FiShield), named:FiBriefcase(FiBriefcase), named:FiFileText(FiFileText), named:FiLogOut(FiLogOut)
  - from `clsx` — default:clsx
  - from `../../store/useUIStore` — default:useUIStore
  - from `../../context/AuthContext` — named:useAuth(useAuth)
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
  - from `react-hot-toast` — default:toast
- exports: default

### frontend\src\components\Dashboard\DashboardChart.jsx
- Lines: 167
- import statements:
  - from `react` — default:React
  - from `react-chartjs-2` — named:Bar(Bar)
  - from `chart.js` — named:ChartJS(Chart), named:CategoryScale(CategoryScale), named:LinearScale(LinearScale), named:BarElement(BarElement), named:LineElement(LineElement), named:PointElement(PointElement), named:Title(Title), named:Tooltip(Tooltip), named:Legend(Legend)
  - from `framer-motion` — named:motion(motion)
  - from `../Common/LoadingSpinner` — default:LoadingSpinner
- exports: default

### frontend\src\components\Dashboard\RecentActivity.jsx
- Lines: 118
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect)
  - from `react-icons/fi` — named:FiUpload(FiUpload), named:FiCheck(FiCheck), named:FiX(FiX), named:FiBriefcase(FiBriefcase), named:FiUserPlus(FiUserPlus), named:FiLogIn(FiLogIn), named:FiPhone(FiPhone), named:FiMail(FiMail), named:FiFileText(FiFileText)
  - from `framer-motion` — named:motion(motion)
  - from `date-fns` — named:formatDistanceToNow(formatDistanceToNow)
  - from `../../lib/api` — default:api
  - from `../Common/LoadingSpinner` — default:LoadingSpinner
- exports: default
- detected route calls (1):
  - method: get path: /activity-logs?limit=5

### frontend\src\components\Dashboard\StatCard.jsx
- Lines: 58
- import statements:
  - from `react` — default:React
  - from `framer-motion` — named:motion(motion)
  - from `react-icons/fi` — named:FiTrendingUp(FiTrendingUp)
- exports: default

### frontend\src\components\HR\LogCallModal.jsx
- Lines: 151
- import statements:
  - from `react` — default:React, named:useState(useState)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `react-icons/fi` — named:FiX(FiX), named:FiPhoneCall(FiPhoneCall)
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
  - from `../Common/LoadingSpinner` — default:LoadingSpinner
- exports: default
- detected route calls (1):
  - method: post path: /call-logs

### frontend\src\components\HR\ResumeUpload.jsx
- Lines: 153
- import statements:
  - from `react` — default:React, named:useState(useState), named:useCallback(useCallback)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `react-icons/fi` — named:FiUploadCloud(FiUploadCloud), named:FiFileText(FiFileText), named:FiXCircle(FiXCircle)
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
  - from `../Common/LoadingSpinner` — default:LoadingSpinner
- exports: default
- detected route calls (1):
  - method: post path: /candidates/hr-upload

### frontend\src\components\HR\SendEmailModal.jsx
- Lines: 128
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `react-icons/fi` — named:FiX(FiX), named:FiMail(FiMail)
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
  - from `../Common/LoadingSpinner` — default:LoadingSpinner
- exports: default
- detected route calls (1):
  - method: post path: /emails/send

### frontend\src\pages\Admin\AdminCreateJobPage.jsx
- Lines: 138
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `framer-motion` — named:motion(motion)
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-icons/fi` — named:FiBriefcase(FiBriefcase)
- exports: default
- detected route calls (3):
  - method: get path: /sectors
  - method: get path: (dynamic/unknown)
  - method: post path: /jobs

### frontend\src\pages\Admin\AdminDashboardPage.jsx
- Lines: 82
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect)
  - from `../../components/Dashboard/StatCard` — default:StatCard
  - from `../../components/Dashboard/DashboardChart` — default:DashboardChart
  - from `../../components/Dashboard/RecentActivity` — default:RecentActivity
  - from `react-icons/fi` — named:FiUsers(FiUsers), named:FiBriefcase(FiBriefcase), named:FiClipboard(FiClipboard), named:FiTrendingUp(FiTrendingUp)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `framer-motion` — named:motion(motion)
- exports: default
- detected route calls (1):
  - method: get path: /dashboard/stats

### frontend\src\pages\Admin\AdminHrManagementPage.jsx
- Lines: 158
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-icons/fi` — named:FiPlus(FiPlus), named:FiX(FiX), named:FiUsers(FiUsers), named:FiChevronLeft(FiChevronLeft), named:FiChevronRight(FiChevronRight)
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
- exports: default
- detected route calls (2):
  - method: post path: /auth/register
  - method: get path: (dynamic/unknown)

### frontend\src\pages\Admin\AdminManageDesignationsPage.jsx
- Lines: 165
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-icons/fi` — named:FiPlus(FiPlus), named:FiX(FiX), named:FiEdit(FiEdit), named:FiTrash2(FiTrash2), named:FiTag(FiTag), named:FiChevronLeft(FiChevronLeft), named:FiChevronRight(FiChevronRight)
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
- exports: default
- detected route calls (6):
  - method: put path: (dynamic/unknown)
  - method: all path: (dynamic/unknown)
  - method: get path: /sectors
  - method: get path: (dynamic/unknown)
  - method: post path: /designations
  - method: delete path: (dynamic/unknown)

### frontend\src\pages\Admin\AdminManageJobsPage.jsx
- Lines: 202
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-icons/fi` — named:FiPlus(FiPlus), named:FiX(FiX), named:FiEdit(FiEdit), named:FiTrash2(FiTrash2), named:FiTag(FiTag), named:FiChevronLeft(FiChevronLeft), named:FiChevronRight(FiChevronRight)
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
- exports: default
- detected route calls (6):
  - method: put path: (dynamic/unknown)
  - method: all path: (dynamic/unknown)
  - method: get path: /sectors
  - method: get path: (dynamic/unknown)
  - method: post path: /designations
  - method: delete path: (dynamic/unknown)

### frontend\src\pages\Admin\AdminManageSectorsPage.jsx
- Lines: 183
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-icons/fi` — named:FiPlus(FiPlus), named:FiX(FiX), named:FiEdit(FiEdit), named:FiTrash2(FiTrash2), named:FiFolder(FiFolder), named:FiChevronLeft(FiChevronLeft), named:FiChevronRight(FiChevronRight)
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
- exports: default
- detected route calls (4):
  - method: put path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: post path: /sectors
  - method: delete path: (dynamic/unknown)

### frontend\src\pages\Admin\AdminViewReportsPage.jsx
- Lines: 130
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-icons/fi` — named:FiCheck(FiCheck), named:FiX(FiX), named:FiChevronLeft(FiChevronLeft), named:FiChevronRight(FiChevronRight), named:FiFileText(FiFileText)
  - from `clsx` — default:clsx
  - from `framer-motion` — named:motion(motion)
  - from `date-fns` — named:format(format)
- exports: default
- detected route calls (2):
  - method: get path: (dynamic/unknown)
  - method: put path: (dynamic/unknown)

### frontend\src\pages\Candidate\CandidateApplyPage.jsx
- Lines: 160
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `react-router-dom` — named:useParams(useParams), named:Link(Link)
  - from `react-hot-toast` — default:toast
  - from `react-icons/fi` — named:FiUploadCloud(FiUploadCloud), named:FiFileText(FiFileText), named:FiXCircle(FiXCircle), named:FiArrowLeft(FiArrowLeft)
  - from `../../lib/api` — default:api
  - from `framer-motion` — named:motion(motion)
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
- exports: default
- detected route calls (1):
  - method: post path: /candidates/apply

### frontend\src\pages\Candidate\CandidateHomePage.jsx
- Lines: 126
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `../../components/Candidate/JobListing` — default:JobListing
  - from `react-icons/fi` — named:FiSearch(FiSearch), named:FiLoader(FiLoader), named:FiChevronLeft(FiChevronLeft), named:FiChevronRight(FiChevronRight)
  - from `framer-motion` — named:motion(motion)
- exports: default
- detected route calls (1):
  - method: get path: (dynamic/unknown)

### frontend\src\pages\HR\HRCandidateDetailsPage.jsx
- Lines: 234
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `react-router-dom` — named:useParams(useParams), named:Link(Link)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-icons/fi` — named:FiUser(FiUser), named:FiMail(FiMail), named:FiPhone(FiPhone), named:FiFileText(FiFileText), named:FiBriefcase(FiBriefcase), named:FiMapPin(FiMapPin), named:FiArrowLeft(FiArrowLeft), named:FiSave(FiSave), named:FiMessageSquare(FiMessageSquare), named:FiPhoneCall(FiPhoneCall)
  - from `clsx` — default:clsx
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
  - from `date-fns` — named:format(format), named:formatDistanceToNow(formatDistanceToNow)
- exports: default
- detected route calls (7):
  - method: post path: /notes
  - method: all path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: put path: (dynamic/unknown)

### frontend\src\pages\HR\HRCandidatesPage.jsx
- Lines: 170
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `react-router-dom` — named:Link(Link)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `react-icons/fi` — named:FiEye(FiEye), named:FiPhone(FiPhone), named:FiMail(FiMail), named:FiChevronLeft(FiChevronLeft), named:FiChevronRight(FiChevronRight), named:FiSearch(FiSearch), named:FiUsers(FiUsers)
  - from `../../components/HR/LogCallModal` — default:LogCallModal
  - from `../../components/HR/SendEmailModal` — default:SendEmailModal
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
  - from `clsx` — default:clsx
- exports: default
- detected route calls (1):
  - method: get path: (dynamic/unknown)

### frontend\src\pages\HR\HRCreateJobPage.jsx
- Lines: 138
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `framer-motion` — named:motion(motion)
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-icons/fi` — named:FiBriefcase(FiBriefcase)
- exports: default
- detected route calls (3):
  - method: get path: /sectors
  - method: get path: (dynamic/unknown)
  - method: post path: /jobs

### frontend\src\pages\HR\HRDashboardPage.jsx
- Lines: 87
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect)
  - from `../../components/Dashboard/StatCard` — default:StatCard
  - from `../../components/Dashboard/RecentActivity` — default:RecentActivity
  - from `../../components/HR/ResumeUpload` — default:ResumeUpload
  - from `react-icons/fi` — named:FiUsers(FiUsers), named:FiBriefcase(FiBriefcase), named:FiTrendingUp(FiTrendingUp)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `framer-motion` — named:motion(motion)
- exports: default
- detected route calls (1):
  - method: get path: /dashboard/stats

### frontend\src\pages\HR\HRReviewQueuePage.jsx
- Lines: 168
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `react-router-dom` — named:Link(Link)
  - from `react-hot-toast` — default:toast
  - from `framer-motion` — named:motion(motion)
- exports: default
- detected route calls (1):
  - method: get path: /candidates/review-queue

### frontend\src\pages\HR\HRSubmitReportPage.jsx
- Lines: 111
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `framer-motion` — named:motion(motion)
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-icons/fi` — named:FiFileText(FiFileText)
- exports: default
- detected route calls (1):
  - method: post path: /reports

### frontend\src\pages\SuperAdmin\LiveStatusPanel.jsx
- Lines: 239
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect)
  - from `pusher-js` — default:Pusher
  - from `../../context/AuthContext` — named:useAuth(useAuth)
  - from `react-icons/fi` — named:FiCircle(FiCircle), named:FiBriefcase(FiBriefcase), named:FiUserPlus(FiUserPlus), named:FiLogIn(FiLogIn), named:FiPhone(FiPhone), named:FiMail(FiMail), named:FiFileText(FiFileText), named:FiSettings(FiSettings), named:FiTrash2(FiTrash2), named:FiEdit(FiEdit), named:FiUsers(FiUsers)
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
  - from `date-fns` — named:formatDistanceToNow(formatDistanceToNow)
  - from `clsx` — default:clsx
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
- exports: default
- detected route calls (2):
  - method: delete path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)

### frontend\src\pages\SuperAdmin\SuperAdminDashboardPage.jsx
- Lines: 93
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect)
  - from `../../components/Dashboard/StatCard` — default:StatCard
  - from `../../components/Dashboard/DashboardChart` — default:DashboardChart
  - from `./LiveStatusPanel` — default:LiveStatusPanel
  - from `react-icons/fi` — named:FiUsers(FiUsers), named:FiFileText(FiFileText), named:FiBriefcase(FiBriefcase), named:FiUserPlus(FiUserPlus), named:FiFilePlus(FiFilePlus)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `framer-motion` — named:motion(motion)
- exports: default
- detected route calls (1):
  - method: get path: /dashboard/stats

### frontend\src\pages\SuperAdmin\SuperAdminSettingsPage.jsx
- Lines: 122
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect)
  - from `react-hook-form` — named:useForm(useForm), named:Controller(Controller)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-icons/fi` — named:FiSave(FiSave), named:FiSettings(FiSettings)
  - from `framer-motion` — named:motion(motion)
- exports: default
- detected route calls (2):
  - method: get path: /settings
  - method: put path: /settings

### frontend\src\pages\SuperAdmin\SuperAdminUserManagementPage.jsx
- Lines: 154
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-icons/fi` — named:FiPlus(FiPlus), named:FiX(FiX), named:FiEdit(FiEdit), named:FiTrash2(FiTrash2), named:FiUserCheck(FiUserCheck), named:FiUserX(FiUserX), named:FiSearch(FiSearch), named:FiChevronLeft(FiChevronLeft), named:FiChevronRight(FiChevronRight)
  - from `framer-motion` — named:motion(motion), named:AnimatePresence(AnimatePresence)
  - from `clsx` — default:clsx
- exports: default
- detected route calls (3):
  - method: put path: (dynamic/unknown)
  - method: get path: (dynamic/unknown)
  - method: put path: (dynamic/unknown)

### frontend\src\pages\Shared\ActivityLogPage.jsx
- Lines: 136
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect), named:useCallback(useCallback)
  - from `../../lib/api` — default:api
  - from `react-hot-toast` — default:toast
  - from `react-icons/fi` — named:FiClock(FiClock), named:FiChevronLeft(FiChevronLeft), named:FiChevronRight(FiChevronRight), named:FiBriefcase(FiBriefcase), named:FiUserPlus(FiUserPlus), named:FiLogIn(FiLogIn), named:FiPhone(FiPhone), named:FiMail(FiMail), named:FiFileText(FiFileText), named:FiSettings(FiSettings), named:FiTrash2(FiTrash2), named:FiEdit(FiEdit)
  - from `framer-motion` — named:motion(motion)
  - from `date-fns` — named:formatDistanceToNow(formatDistanceToNow)
  - from `clsx` — default:clsx
- exports: default
- detected route calls (1):
  - method: get path: (dynamic/unknown)

### frontend\src\pages\Shared\AuthSuccessPage.jsx
- Lines: 75
- import statements:
  - from `react` — default:React, named:useEffect(useEffect)
  - from `react-router-dom` — named:useNavigate(useNavigate), named:useLocation(useLocation)
  - from `../../context/AuthContext` — named:useAuth(useAuth)
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
  - from `react-hot-toast` — default:toast
  - from `framer-motion` — named:motion(motion)
- exports: default
- detected route calls (3):
  - method: get path: token
  - method: get path: status
  - method: get path: error

### frontend\src\pages\Shared\LoginPage.jsx
- Lines: 105
- import statements:
  - from `react` — default:React, named:useState(useState), named:useEffect(useEffect)
  - from `react-hook-form` — named:useForm(useForm)
  - from `../../context/AuthContext` — named:useAuth(useAuth)
  - from `react-icons/fi` — named:FiEye(FiEye), named:FiEyeOff(FiEyeOff), named:FiLogIn(FiLogIn)
  - from `react-icons/fc` — named:FcGoogle(FcGoogle)
  - from `framer-motion` — named:motion(motion)
  - from `react-router-dom` — named:useLocation(useLocation), named:Link(Link)
  - from `react-hot-toast` — default:toast
  - from `../../components/Common/LoadingSpinner` — default:LoadingSpinner
- exports: default
- detected route calls (1):
  - method: get path: status

### frontend\src\pages\Shared\NotFoundPage.jsx
- Lines: 87
- import statements:
  - from `react` — default:React, named:useEffect(useEffect)
  - from `react-router-dom` — named:Link(Link)
  - from `framer-motion` — named:motion(motion)
  - from `react-icons/fi` — named:FiHome(FiHome)
- exports: default

---
## 4) Missing relative imports (unresolved)
- ✅ No obvious missing relative imports detected.

---
## 5) Circular dependencies (cycles)
- ✅ No cycles detected (good!).

---
## 6) Orphaned files (no incoming imports, not common entry files)
- deep_analyzer.js
- package-lock.json
- package.json
- project_analyzer.js
- backend\package-lock.json
- backend\package.json
- frontend\index.html
- frontend\package-lock.json
- frontend\package.json
- frontend\postcss.config.js
- frontend\tailwind.config.js
- frontend\vite.config.js
- frontend\public\manifest.json
- frontend\src\main.jsx

---
## 7) Possibly unused exports (heuristic)
- none flagged.

---
## 8) Express routes discovered (file | method | path)
- deep_analyzer.js | DELETE | (dynamic/unknown)
- deep_analyzer.js | GET | (dynamic/unknown)
- deep_analyzer.js | GET | (dynamic/unknown)
- deep_analyzer.js | GET | (dynamic/unknown)
- backend\src\server.js | USE | (dynamic/unknown)
- backend\src\server.js | USE | (dynamic/unknown)
- backend\src\server.js | USE | (dynamic/unknown)
- backend\src\server.js | USE | (dynamic/unknown)
- backend\src\server.js | USE | /api/auth
- backend\src\server.js | USE | /api/candidates
- backend\src\server.js | USE | /api/jobs
- backend\src\server.js | USE | /api/dashboard
- backend\src\server.js | USE | /api/call-logs
- backend\src\server.js | USE | /api/emails
- backend\src\server.js | USE | /api/notes
- backend\src\server.js | USE | /api/reports
- backend\src\server.js | USE | /api/sectors
- backend\src\server.js | USE | /api/designations
- backend\src\server.js | USE | /api/users
- backend\src\server.js | USE | /api/settings
- backend\src\server.js | USE | /api/activity-logs
- backend\src\server.js | USE | /api/pusher
- backend\src\server.js | USE | /uploads
- backend\src\server.js | USE | (dynamic/unknown)
- backend\src\server.js | USE | (dynamic/unknown)
- backend\src\config\passport.js | USE | (dynamic/unknown)
- backend\src\routes\activityLogRoutes.js | GET | /
- backend\src\routes\authRoutes.js | POST | /register
- backend\src\routes\authRoutes.js | POST | /login
- backend\src\routes\authRoutes.js | GET | /me
- backend\src\routes\authRoutes.js | GET | /google
- backend\src\routes\authRoutes.js | GET | /google/callback
- backend\src\routes\authRoutes.js | GET | /success
- backend\src\routes\callLogRoutes.js | POST | (dynamic/unknown)
- backend\src\routes\callLogRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\candidateRoutes.js | POST | /apply
- backend\src\routes\candidateRoutes.js | POST | (dynamic/unknown)
- backend\src\routes\candidateRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\candidateRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\candidateRoutes.js | PUT | (dynamic/unknown)
- backend\src\routes\candidateRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\candidateRoutes.js | PUT | (dynamic/unknown)
- backend\src\routes\dailyReportRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\dailyReportRoutes.js | POST | (dynamic/unknown)
- backend\src\routes\dailyReportRoutes.js | PUT | (dynamic/unknown)
- backend\src\routes\dashboardRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\designationRoutes.js | POST | (dynamic/unknown)
- backend\src\routes\designationRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\emailLogRoutes.js | POST | (dynamic/unknown)
- backend\src\routes\emailLogRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\jobRoutes.js | POST | (dynamic/unknown)
- backend\src\routes\jobRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\jobRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\jobRoutes.js | DELETE | (dynamic/unknown)
- backend\src\routes\jobRoutes.js | PUT | (dynamic/unknown)
- backend\src\routes\noteRoutes.js | POST | (dynamic/unknown)
- backend\src\routes\noteRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\pusherRoutes.js | POST | /auth
- backend\src\routes\sectorRoutes.js | POST | (dynamic/unknown)
- backend\src\routes\sectorRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\settingsRoutes.js | PUT | (dynamic/unknown)
- backend\src\routes\settingsRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\userRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\userRoutes.js | GET | (dynamic/unknown)
- backend\src\routes\userRoutes.js | DELETE | (dynamic/unknown)
- backend\src\routes\userRoutes.js | PUT | (dynamic/unknown)
- backend\src\routes\userRoutes.js | PUT | (dynamic/unknown)
- backend\src\routes\userRoutes.js | PUT | (dynamic/unknown)
- frontend\src\context\AuthContext.jsx | GET | /auth/me
- frontend\src\context\AuthContext.jsx | POST | /auth/login
- frontend\src\context\AuthContext.jsx | GET | /auth/me
- frontend\src\lib\api.js | USE | (dynamic/unknown)
- frontend\src\lib\api.js | USE | (dynamic/unknown)
- frontend\src\components\Dashboard\RecentActivity.jsx | GET | /activity-logs?limit=5
- frontend\src\components\HR\LogCallModal.jsx | POST | /call-logs
- frontend\src\components\HR\ResumeUpload.jsx | POST | /candidates/hr-upload
- frontend\src\components\HR\SendEmailModal.jsx | POST | /emails/send
- frontend\src\pages\Admin\AdminCreateJobPage.jsx | GET | /sectors
- frontend\src\pages\Admin\AdminCreateJobPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\Admin\AdminCreateJobPage.jsx | POST | /jobs
- frontend\src\pages\Admin\AdminDashboardPage.jsx | GET | /dashboard/stats
- frontend\src\pages\Admin\AdminHrManagementPage.jsx | POST | /auth/register
- frontend\src\pages\Admin\AdminHrManagementPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\Admin\AdminManageDesignationsPage.jsx | PUT | (dynamic/unknown)
- frontend\src\pages\Admin\AdminManageDesignationsPage.jsx | ALL | (dynamic/unknown)
- frontend\src\pages\Admin\AdminManageDesignationsPage.jsx | GET | /sectors
- frontend\src\pages\Admin\AdminManageDesignationsPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\Admin\AdminManageDesignationsPage.jsx | POST | /designations
- frontend\src\pages\Admin\AdminManageDesignationsPage.jsx | DELETE | (dynamic/unknown)
- frontend\src\pages\Admin\AdminManageJobsPage.jsx | PUT | (dynamic/unknown)
- frontend\src\pages\Admin\AdminManageJobsPage.jsx | ALL | (dynamic/unknown)
- frontend\src\pages\Admin\AdminManageJobsPage.jsx | GET | /sectors
- frontend\src\pages\Admin\AdminManageJobsPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\Admin\AdminManageJobsPage.jsx | POST | /designations
- frontend\src\pages\Admin\AdminManageJobsPage.jsx | DELETE | (dynamic/unknown)
- frontend\src\pages\Admin\AdminManageSectorsPage.jsx | PUT | (dynamic/unknown)
- frontend\src\pages\Admin\AdminManageSectorsPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\Admin\AdminManageSectorsPage.jsx | POST | /sectors
- frontend\src\pages\Admin\AdminManageSectorsPage.jsx | DELETE | (dynamic/unknown)
- frontend\src\pages\Admin\AdminViewReportsPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\Admin\AdminViewReportsPage.jsx | PUT | (dynamic/unknown)
- frontend\src\pages\Candidate\CandidateApplyPage.jsx | POST | /candidates/apply
- frontend\src\pages\Candidate\CandidateHomePage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\HR\HRCandidateDetailsPage.jsx | POST | /notes
- frontend\src\pages\HR\HRCandidateDetailsPage.jsx | ALL | (dynamic/unknown)
- frontend\src\pages\HR\HRCandidateDetailsPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\HR\HRCandidateDetailsPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\HR\HRCandidateDetailsPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\HR\HRCandidateDetailsPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\HR\HRCandidateDetailsPage.jsx | PUT | (dynamic/unknown)
- frontend\src\pages\HR\HRCandidatesPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\HR\HRCreateJobPage.jsx | GET | /sectors
- frontend\src\pages\HR\HRCreateJobPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\HR\HRCreateJobPage.jsx | POST | /jobs
- frontend\src\pages\HR\HRDashboardPage.jsx | GET | /dashboard/stats
- frontend\src\pages\HR\HRReviewQueuePage.jsx | GET | /candidates/review-queue
- frontend\src\pages\HR\HRSubmitReportPage.jsx | POST | /reports
- frontend\src\pages\SuperAdmin\LiveStatusPanel.jsx | DELETE | (dynamic/unknown)
- frontend\src\pages\SuperAdmin\LiveStatusPanel.jsx | GET | (dynamic/unknown)
- frontend\src\pages\SuperAdmin\SuperAdminDashboardPage.jsx | GET | /dashboard/stats
- frontend\src\pages\SuperAdmin\SuperAdminSettingsPage.jsx | GET | /settings
- frontend\src\pages\SuperAdmin\SuperAdminSettingsPage.jsx | PUT | /settings
- frontend\src\pages\SuperAdmin\SuperAdminUserManagementPage.jsx | PUT | (dynamic/unknown)
- frontend\src\pages\SuperAdmin\SuperAdminUserManagementPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\SuperAdmin\SuperAdminUserManagementPage.jsx | PUT | (dynamic/unknown)
- frontend\src\pages\Shared\ActivityLogPage.jsx | GET | (dynamic/unknown)
- frontend\src\pages\Shared\AuthSuccessPage.jsx | GET | token
- frontend\src\pages\Shared\AuthSuccessPage.jsx | GET | status
- frontend\src\pages\Shared\AuthSuccessPage.jsx | GET | error
- frontend\src\pages\Shared\LoginPage.jsx | GET | status

---
## 9) Dynamic probe results (GET-only probes)
- http://localhost:3000/ => OK (200)
- http://localhost:3000/health => OK (200)
- http://localhost:3000/api/health => ERROR (ERR_BAD_REQUEST)
- http://localhost:3000/ping => OK (200)
- http://localhost:3000/api/ping => ERROR (ERR_BAD_REQUEST)
- http://localhost:3001/ => ERROR (ECONNREFUSED)
- http://localhost:3001/health => ERROR (ECONNREFUSED)
- http://localhost:3001/api/health => ERROR (ECONNREFUSED)
- http://localhost:3001/ping => ERROR (ECONNREFUSED)
- http://localhost:3001/api/ping => ERROR (ECONNREFUSED)
- http://localhost:3002/ => ERROR (ECONNREFUSED)
- http://localhost:3002/health => ERROR (ECONNREFUSED)
- http://localhost:3002/api/health => ERROR (ECONNREFUSED)
- http://localhost:3002/ping => ERROR (ECONNREFUSED)
- http://localhost:3002/api/ping => ERROR (ECONNREFUSED)
- http://localhost:4000/ => ERROR (ECONNREFUSED)
- http://localhost:4000/health => ERROR (ECONNREFUSED)
- http://localhost:4000/api/health => ERROR (ECONNREFUSED)
- http://localhost:4000/ping => ERROR (ECONNREFUSED)
- http://localhost:4000/api/ping => ERROR (ECONNREFUSED)
- http://localhost:5000/ => ERROR (ERR_BAD_REQUEST)
- http://localhost:5000/health => ERROR (ERR_BAD_REQUEST)
- http://localhost:5000/api/health => ERROR (ERR_BAD_REQUEST)
- http://localhost:5000/ping => ERROR (ERR_BAD_REQUEST)
- http://localhost:5000/api/ping => ERROR (ERR_BAD_REQUEST)
- http://localhost:8080/ => ERROR (ECONNREFUSED)
- http://localhost:8080/health => ERROR (ECONNREFUSED)
- http://localhost:8080/api/health => ERROR (ECONNREFUSED)
- http://localhost:8080/ping => ERROR (ECONNREFUSED)
- http://localhost:8080/api/ping => ERROR (ECONNREFUSED)
- route GET / (probes:)
    - http://localhost:3000/ => OK (200)
    - http://localhost:3001/ => ERR (ECONNREFUSED)
    - http://localhost:3002/ => ERR (ECONNREFUSED)
    - http://localhost:4000/ => ERR (ECONNREFUSED)
    - http://localhost:5000/ => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/ => ERR (ECONNREFUSED)
- route GET /me (probes:)
    - http://localhost:3000/me => OK (200)
    - http://localhost:3001/me => ERR (ECONNREFUSED)
    - http://localhost:3002/me => ERR (ECONNREFUSED)
    - http://localhost:4000/me => ERR (ECONNREFUSED)
    - http://localhost:5000/me => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/me => ERR (ECONNREFUSED)
- route GET /google (probes:)
    - http://localhost:3000/google => OK (200)
    - http://localhost:3001/google => ERR (ECONNREFUSED)
    - http://localhost:3002/google => ERR (ECONNREFUSED)
    - http://localhost:4000/google => ERR (ECONNREFUSED)
    - http://localhost:5000/google => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/google => ERR (ECONNREFUSED)
- route GET /google/callback (probes:)
    - http://localhost:3000/google/callback => OK (200)
    - http://localhost:3001/google/callback => ERR (ECONNREFUSED)
    - http://localhost:3002/google/callback => ERR (ECONNREFUSED)
    - http://localhost:4000/google/callback => ERR (ECONNREFUSED)
    - http://localhost:5000/google/callback => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/google/callback => ERR (ECONNREFUSED)
- route GET /success (probes:)
    - http://localhost:3000/success => OK (200)
    - http://localhost:3001/success => ERR (ECONNREFUSED)
    - http://localhost:3002/success => ERR (ECONNREFUSED)
    - http://localhost:4000/success => ERR (ECONNREFUSED)
    - http://localhost:5000/success => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/success => ERR (ECONNREFUSED)
- route GET /auth/me (probes:)
    - http://localhost:3000/auth/me => OK (200)
    - http://localhost:3001/auth/me => ERR (ECONNREFUSED)
    - http://localhost:3002/auth/me => ERR (ECONNREFUSED)
    - http://localhost:4000/auth/me => ERR (ECONNREFUSED)
    - http://localhost:5000/auth/me => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/auth/me => ERR (ECONNREFUSED)
- route GET /auth/me (probes:)
    - http://localhost:3000/auth/me => OK (200)
    - http://localhost:3001/auth/me => ERR (ECONNREFUSED)
    - http://localhost:3002/auth/me => ERR (ECONNREFUSED)
    - http://localhost:4000/auth/me => ERR (ECONNREFUSED)
    - http://localhost:5000/auth/me => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/auth/me => ERR (ECONNREFUSED)
- route GET /activity-logs?limit=5 (probes:)
    - http://localhost:3000/activity-logs?limit=5 => OK (200)
    - http://localhost:3001/activity-logs?limit=5 => ERR (ECONNREFUSED)
    - http://localhost:3002/activity-logs?limit=5 => ERR (ECONNREFUSED)
    - http://localhost:4000/activity-logs?limit=5 => ERR (ECONNREFUSED)
    - http://localhost:5000/activity-logs?limit=5 => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/activity-logs?limit=5 => ERR (ECONNREFUSED)
- route GET /sectors (probes:)
    - http://localhost:3000/sectors => OK (200)
    - http://localhost:3001/sectors => ERR (ECONNREFUSED)
    - http://localhost:3002/sectors => ERR (ECONNREFUSED)
    - http://localhost:4000/sectors => ERR (ECONNREFUSED)
    - http://localhost:5000/sectors => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/sectors => ERR (ECONNREFUSED)
- route GET /dashboard/stats (probes:)
    - http://localhost:3000/dashboard/stats => OK (200)
    - http://localhost:3001/dashboard/stats => ERR (ECONNREFUSED)
    - http://localhost:3002/dashboard/stats => ERR (ECONNREFUSED)
    - http://localhost:4000/dashboard/stats => ERR (ECONNREFUSED)
    - http://localhost:5000/dashboard/stats => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/dashboard/stats => ERR (ECONNREFUSED)
- route GET /sectors (probes:)
    - http://localhost:3000/sectors => OK (200)
    - http://localhost:3001/sectors => ERR (ECONNREFUSED)
    - http://localhost:3002/sectors => ERR (ECONNREFUSED)
    - http://localhost:4000/sectors => ERR (ECONNREFUSED)
    - http://localhost:5000/sectors => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/sectors => ERR (ECONNREFUSED)
- route GET /sectors (probes:)
    - http://localhost:3000/sectors => OK (200)
    - http://localhost:3001/sectors => ERR (ECONNREFUSED)
    - http://localhost:3002/sectors => ERR (ECONNREFUSED)
    - http://localhost:4000/sectors => ERR (ECONNREFUSED)
    - http://localhost:5000/sectors => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/sectors => ERR (ECONNREFUSED)
- route GET /sectors (probes:)
    - http://localhost:3000/sectors => OK (200)
    - http://localhost:3001/sectors => ERR (ECONNREFUSED)
    - http://localhost:3002/sectors => ERR (ECONNREFUSED)
    - http://localhost:4000/sectors => ERR (ECONNREFUSED)
    - http://localhost:5000/sectors => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/sectors => ERR (ECONNREFUSED)
- route GET /dashboard/stats (probes:)
    - http://localhost:3000/dashboard/stats => OK (200)
    - http://localhost:3001/dashboard/stats => ERR (ECONNREFUSED)
    - http://localhost:3002/dashboard/stats => ERR (ECONNREFUSED)
    - http://localhost:4000/dashboard/stats => ERR (ECONNREFUSED)
    - http://localhost:5000/dashboard/stats => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/dashboard/stats => ERR (ECONNREFUSED)
- route GET /candidates/review-queue (probes:)
    - http://localhost:3000/candidates/review-queue => OK (200)
    - http://localhost:3001/candidates/review-queue => ERR (ECONNREFUSED)
    - http://localhost:3002/candidates/review-queue => ERR (ECONNREFUSED)
    - http://localhost:4000/candidates/review-queue => ERR (ECONNREFUSED)
    - http://localhost:5000/candidates/review-queue => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/candidates/review-queue => ERR (ECONNREFUSED)
- route GET /dashboard/stats (probes:)
    - http://localhost:3000/dashboard/stats => OK (200)
    - http://localhost:3001/dashboard/stats => ERR (ECONNREFUSED)
    - http://localhost:3002/dashboard/stats => ERR (ECONNREFUSED)
    - http://localhost:4000/dashboard/stats => ERR (ECONNREFUSED)
    - http://localhost:5000/dashboard/stats => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/dashboard/stats => ERR (ECONNREFUSED)
- route GET /settings (probes:)
    - http://localhost:3000/settings => OK (200)
    - http://localhost:3001/settings => ERR (ECONNREFUSED)
    - http://localhost:3002/settings => ERR (ECONNREFUSED)
    - http://localhost:4000/settings => ERR (ECONNREFUSED)
    - http://localhost:5000/settings => ERR (ERR_BAD_REQUEST)
    - http://localhost:8080/settings => ERR (ECONNREFUSED)

---
## 10) Quick recommended next steps (automated hints)
- Fix missing relative imports listed above.
- Open cycle traces and restructure imports (break circular dep by extracting shared util).
- Check orphan files: if they are meant to be used, verify imports; otherwise archive/remove them.
- For parse errors, open the file and run a linter or check TS config.
- If dynamic probes fail but your services should be running, ensure env variables (DB, API keys) are set and start the server in dev mode first.


---
_Report generated by deep_analyzer.js_