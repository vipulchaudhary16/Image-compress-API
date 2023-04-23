const express = require("express");
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const multer = require("multer");
const router = express.Router();
const sharp = require('sharp');
require('dotenv').config()

const firebaseConfig = {
    apiKey: process.env.FIREBASE_KEY,
    authDomain: "compress-storage-e6a11.firebaseapp.com",
    projectId: "compress-storage-e6a11",
    storageBucket: "compress-storage-e6a11.appspot.com",
    messagingSenderId: "115364140283",
    appId: "1:115364140283:web:5064ca3f18caf302f84c5e",
    measurementId: "G-6287JY0RQ7"
};

initializeApp(firebaseConfig);
const storage = getStorage();

router.get("/", (req, res) => {
    res.send("Ready to compress")
})

const upload = multer({ storage: multer.memoryStorage() });
router.post("/compress", upload.single("file-to-compress"), async (req, res) => {
    try {
        const image = req.file
        console.log(req.body)
        const quality = parseInt(req.body.quality )
        console.log(`File name: ${req.file.originalname}`)
        console.log(`File size: ${req.file.size}`)
        console.log(`File type: ${req.file.mimetype}`)
        console.log(`File quality: ${quality}`)
        await sharp(image.buffer)
            .jpeg({ quality: 100 - quality + 1 })
            .toBuffer()
            .catch((e) => {
                console.log(e)
            }).then(async (response) => {
                const storageRef = ref(storage, `files/${req.file.originalname}`);
                const snapshot = await uploadBytesResumable(storageRef, response.buffer);
                const downloadURL = await getDownloadURL(snapshot.ref);
                return res.send({
                    message: 'file uploaded to firebase storage',
                    name: req.file.originalname,
                    type: req.file.mimetype,
                    downloadURL: downloadURL
                })
            })
    } catch (error) {
        console.log(error)
        return res.status(400).send(error.message)
    }
});

module.exports = router;
