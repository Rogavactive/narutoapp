const admin = require("firebase-admin");

let secretJson = process.env.NARUTOAPP_CONFIG_JSON
if (secretJson === undefined) {
    secretJson = "./secret/naruto-adminsdk.json"
} else {
    secretJson = JSON.parse(secretJson)
}

admin.initializeApp({
    credential: admin.credential.cert(secretJson),
    databaseURL: "https://naruto-abd88-default-rtdb.europe-west1.firebasedatabase.app"
})

module.exports = admin;