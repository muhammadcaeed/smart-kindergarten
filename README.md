**Smart Kindergarten** is a comprehensive application designed to streamline communication and activity tracking in kindergarten environments. It features three separate panels tailored to administrators, teachers, and parents, along with a robust backend to manage data and interactions.

## Features

* **Real-time Activity Tracking:** Teachers can easily record and track children's daily activities, providing parents with immediate updates. Teachers share details about ongoing activities, and parents can monitor the timing and specifics of each activity in real-time.
* **Health Data Monitoring:** Integration with wearable technology (e.g., MI watch) allows parents to monitor their child's health metrics, including steps, heart rate, sleep, and activity levels.
* **Schedule Management:** Teachers can create and manage daily schedules for different activities, ensuring smooth and organized classroom operations.
* **Seamless Communication:** Built-in chat and messaging features facilitate direct communication between teachers and parents. Teachers and parents can engage in one-on-one chats to discuss a child's progress, concerns, or any other relevant information.
* **Detailed Reporting:**  Generate reports on individual children, providing insights into their daily activities and health data.
* **Secure Authentication:**  Robust authentication mechanisms ensure data privacy and security for all users.

## Live Preview

* **Parents Panel:** https://smart-kindergarten-parents.firebaseapp.com/
* **Admin Panel:** https://smart-kindergarten-admin-panel.firebaseapp.com/
* **Teachers Panel:** https://smart-kindergarten-teachers.firebaseapp.com/

## Technology Stack

* **Frontend:** Ionic Framework (Angular 2)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Health Data Integration:**  Cordova Health Plugin
* **Hosting:** Firebase (Frontend), Heroku (Backend)

## Health Data Integration

The Parent Panel application utilizes the Cordova Health Plugin to access and track children's health data from wearable devices. This plugin allows the app to:

* **Request authorization:**  Request user permission to access health data.
* **Query health data:** Retrieve various health metrics like steps, calories, distance, heart rate, and activity levels.
* **Aggregate data:**  Aggregate data by day or other time intervals for analysis and reporting.
* **Send data to the server:**  Transmit collected health data to the backend server for storage and further processing.

**Note:** The Health Plugin requires a compatible wearable device and user authorization to access health information.


## API Routes

### Teachers

| Route | Method | Description |
|---|---|---|
| /getActivities | GET | Get all activities |
| /getPlans | GET | Get all plans |
| /newActivity | POST | Create a new activity |
| /newPlan | POST | Create a new plan |
| /updateteacher/:_id | PUT | Update teacher information |
| /:current | GET | Get current teacher information |
| /changePassword | PUT | Change teacher password |
| /unique/:user | PUT | Check username uniqueness |
| /confirmation | PUT | Confirm teacher account |
| /authenticate | POST | Authenticate teacher login |

### Users

| Route | Method | Description |
|---|---|---|
| /inbox | POST | Send message to inbox |
| /getChat | GET | Get chat messages |
| /chat | POST | Send chat message |
| /forgot | POST | Initiate password reset |
| /showHealthData | POST | Show health data |
| /collectData | POST | Collect health data |
| /findByUserId/:_id | GET | Find user by ID |
| /sendNotification | POST | Send notification |
| /registerDevice | POST | Register device |
| /teacher/:_id | DELETE | Delete teacher |
| /teacher | POST | Create teacher |
| /updateteacher/:_id | PUT | Update teacher |
| /teacher/:current | GET | Get current teacher |
| /changePasswordAdmin | PUT | Change password (admin) |
| /searchteachers/:tname | GET | Search teachers by name |
| /teachers | GET | Get all teachers |
| /changePassword | PUT | Change password |
| /unique/:user | PUT | Check username uniqueness |
| /confirmation | PUT | Confirm account |
| /updatechild/:_id | PUT | Update child information |
| /authenticate | POST | Authenticate user |
| /register | POST | Register user |
| / | GET | Get all users |
| /children | GET | Get all children |
| /:current | GET | Get current user |
| /searchchildren/:cname | GET | Search children by name |
| /:_id | PUT | Update user |
| /:_id | DELETE | Delete user |
| /child | POST | Create child |
| /profileImgUpload | POST | Upload profile image |

## Installation

1. **Clone the repository:** `git clone https://github.com/your-username/smart-kindergarten.git`
2. **Install server dependencies:** `npm install` in the server directory
3. **Install Ionic dependencies:** `npm install -g ionic` (if you don't have Ionic installed globally)
4. **Install application dependencies:** `npm install` in each application directory (admin, parent, teacher)

## Usage

1. **Configure environment variables:** Create a `.env` file in the server directory and add your MongoDB connection string and any other necessary API keys.
2. **Start the server:** `node server.js`
3. **Run the applications:** Use the Ionic CLI (`ionic serve`) to run each application separately.