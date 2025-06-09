const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());


function readUsers() {
    const data = fs.readFileSync("data.json", "utf8");
    return JSON.parse(data);
}


function writeUsers(users) {
    fs.writeFileSync("data.json", JSON.stringify(users, null, 2));
}

// 1. Add New User (POST /user)
app.post("/user", (req, res) => {
    const { name, age, email } = req.body;
    const users = readUsers();

    if (users.some(user => user.Email === email)) {
        return res.json({ message: "Email already exists." });
    }

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        age,
        Email: email
    };

    users.push(newUser);
    writeUsers(users);
    res.json({ message: "User added successfully." });
});

// 2. Update User (PATCH /user/:id)
app.patch("/user/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const updates = req.body;
    const users = readUsers();

    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return res.json({ message: "User ID not found." });
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    writeUsers(users);
    res.json({ message: "User age updated successfully." });
});

// 3. Delete User (DELETE /user/:id)
app.delete("/user/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const users = readUsers();

    const updatedUsers = users.filter(user => user.id !== userId);

    if (users.length === updatedUsers.length) {
        return res.json({ message: "User ID not found." });
    }

    writeUsers(updatedUsers);
    res.json({ message: "User deleted successfully." });
});

// 4. Get user by name (GET /user/getByName?name=...)
app.get("/user/getByName", (req, res) => {
    const { name } = req.query;
    const users = readUsers();
    const user = users.find(user => user.name === name);
    if (user) {
        return res.json(user);
    } else {
        return res.json({ message: "User name not found." });
    }
});

// 5. Get all users (GET /user)
app.get("/user", (req, res) => {
    const users = readUsers();
    res.json(users);
});

// 6. Filter users by minimum age 
app.get("/user/filter", (req, res) => {
    const minAge = parseInt(req.query.minAge);
    const users = readUsers();
    const filtered = users.filter(user => user.age >= minAge);
    if (filtered.length > 0) {
        res.json(filtered);
    } else {
        res.json({ message: "no user found" });
    }
});

//7 get user by id
app.get("/user/:id",(req,res)=>{
    const userId =parseInt(req.params.id)
    const users = readUsers()
    const user=users.find(user=>user.id===userId)
    if(user){
        res.json(user)
    }else{
        res.json({message:"user not found"})
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
