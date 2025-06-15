import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

//create book
router.post("/", protectRoute, async(req, res) => {
    try {
        const { title, caption, rating, image } = req.body;

        if (!image || !title || !caption || !rating) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        //upload image to cloudinary
        // const uploadResponse = await cloudinary.uploader.upload(image, {
        //     upload_preset: "bookimages",
        // });
        // //Check if the upload was successful
        // if (!uploadResponse || !uploadResponse.secure_url) {
        //     return res.status(500).json({ message: "Error uploading image" });
        // }
        //Get the secure URL of the uploaded image
        //const imageUrl = uploadResponse.data.secure_url;
        //const imageUrl = uploadResponse.secure_url;
        // Add logic to save the book to the database
        const newBook = new Book({
            title,
            caption,
            rating: Number(rating),
            //image: imageUrl,
            image,
            user: req.user._id,
        });
        
        await newBook.save();
        // Return the created book
        return res.status(201).json({ book: newBook });

    } catch (error) {
        console.log("Error in create book route", error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
});

//get all books
router.get("/", protectRoute, async(req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        //get books from db in descending order, skip and limit
        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");

        //Total books
        const totalBooks = await Book.countDocuments();
        // Return the list of books
        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });

    } catch (error) {
        console.log("Error in getting all books route", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//get recommended books
router.get("/user", protectRoute, async(req, res) => {
    try {
        //get books from db in descending order
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
        // Return the list of books from user
        res.send(books);

    } catch (error) {
        console.log("Error in getting recommended books route", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//delete book
router.delete("/:id", protectRoute, async(req, res) => {
    try {
        //find book
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        //check if user is owner
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this book" });
        }   
        //delete image from cloudinary
        if (book.image && book.image.includes("cloudinary")) {  
            try {
                // Extract the public ID from the image URL
                //const publicId = book.image.split("/").pop().split(".")[0];
                const bookImage = book.image;
                const urlParts = bookImage.split('/');
                const fileName = urlParts.pop() || '';
                const publicId = `bookimages/${fileName.split('.')[0]}`;
                console.log("Public ID", publicId);
                await cloudinary.uploader.destroy(publicId);

            } catch (error) {
                console.log("Error deleting image:", error);
                return; 
                //res.status(401).json({ message: "Error deleting image." });
            }
        }

        //delete book
        await book.deleteOne();
        return res.status(200).json({ message: "Book deleted successfully" });
        
    } catch (error) {
        console.log("Error in deleting book route", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});




export default router;