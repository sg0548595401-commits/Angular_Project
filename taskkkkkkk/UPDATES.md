# עדכונים פרויקט - TaskManager

## גרסה 1.0 - עדכונים אחרונים

### 1️⃣ API Endpoints שנוספו/עודכנו

#### ✅ הוספת משתמש לצוות
- **Endpoint**: `POST /api/teams/:teamId/members`
- **Method**: POST
- **Payload**: `{ memberName: string }`
- **תיאור**: מקבל שם משתמש וקישור אותו לצוות
- **Location בקוד**: `src/app/services/teams.service.ts` - `addMemberToTeam()`
- **UI**: `src/app/components/team-list/team-list.ts` - טופס בתוך כרטיס הצוות

#### ✅ מחיקת פרויקט
- **Endpoint**: `DELETE /api/projects/:id`
- **Method**: DELETE
- **תיאור**: מחיקת פרויקט שלם
- **Location בקוד**: `src/app/services/projects.service.ts` - `deleteProject()`
- **UI**: `src/app/components/project-list/project-list.ts` - כפתור עם אייקון אשפה
- **הנדודה**: דיאלוג אישור לפני המחיקה

#### ✅ הבאת פרטי משתמש לפי Token
- **Endpoint**: `GET /api/auth/me`
- **Method**: GET
- **Header**: `Authorization: Bearer <token>`
- **תיאור**: מחזיר את פרטי המשתמש לפי ה-token הנוכחי
- **Location בקוד**: `src/app/services/auth.service.ts` - `getUserFromToken()`
- **שימוש**: עדכון `currentUser` עם פרטי המשתמש מה-token

---

### 2️⃣ Features שמיושמות

| Feature | סטטוס | Location |
|---------|-------|----------|
| התחברות/הרשמה עם JWT | ✅ | `auth.service.ts` |
| צוותים - תצוגה + יצירה | ✅ | `team-list/` |
| פרויקטים - תצוגה + יצירה + מחיקה | ✅ | `project-list/` |
| משימות - CRUD מלא | ✅ | `task-list/` |
| תגובות - תצוגה + הוספה | ✅ | `comments/` |
| הוספת חברים לצוות | ✅ | `team-list.ts` |
| בדיקת הרשאות (403/401) | ✅ | כל service |
| Error banners | ✅ | כל component |

---

### 3️⃣ טיפים לשימוש ב-API

#### הוספת משתמש לצוות
```bash
POST /api/teams/1/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "memberName": "יוסי כהן"
}
```

#### מחיקת פרויקט
```bash
DELETE /api/projects/5
Authorization: Bearer {token}
```

#### בדיקת פרטי משתמש
```bash
GET /api/auth/me
Authorization: Bearer {token}
```

---

### 4️⃣ טיפול בשגיאות

- **401 Unauthorized**: Token לא תקף או מפג - צריך להתחבר מחדש
- **403 Forbidden**: המשתמש לא חבר בצוות/פרויקט
- **404 Not Found**: הנתון לא קיים
- **500 Server Error**: בעיה בבק-אנד

כל השגיאות מוצגות בבנר אדום בחלק העליון של הדף.

---

### 5️⃣ שדרוגים תכניים

- ✅ TypeScript types מעודכנים (Team.id, Project.id as number)
- ✅ Signals לניהול reactive state
- ✅ OnPush change detection
- ✅ Material Design components
- ✅ JWT token handling secure
- ✅ SessionStorage לשמירת token

---

**עדכון אחרון**: 1 בפברואר 2026
