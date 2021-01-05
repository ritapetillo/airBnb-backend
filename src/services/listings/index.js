const express = require("express");
const Listing = require("../../models/Listing");
const Booking = require("../../models/Booking");
const auth = require("../../lib/privateRoutes");
const listingRouter = express.Router();
const Post = require("../../models/Listing");
const multer = require("multer");
const cloudinary = require("../../lib/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
let nodeGeocoder = require("node-geocoder");
const haversine = require("haversine-distance");
const moment = require("moment");
const bookingRouter = require("../bookings");
let options = {
  provider: "openstreetmap",
};

let geoCoder = nodeGeocoder(options);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "listing",
    //   format: async (req, file) => 'png', // supports promises as well
    //   public_id: (req, file) => 'computed-filename-using-request',
  },
});

const parser = multer({ storage: storage });

// GET /listings
//get all the listings
listingRouter.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find().populate("host");
    res.send(posts);
  } catch (err) {
    console.log(err);
  }
});

// GET /listings/:id
//get a plae by id
listingRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.send(listing);
  } catch (err) {
    console.log(err);
    const error = new Error("Listing not found");
    error.code = 404;
    next(error);
  }
});

// POST /listings/
//create new listing
listingRouter.post(
  "/",
  auth,
  parser.array("images"),
  async (req, res, next) => {
    const imagesUris = [];
    if (req.files) {
      const files = req.files;
      files.map((file) => imagesUris.push(file.path));
    }
    if (req.file && req.file.path) {
      // if only one image uploaded
      imagesUris = req.file.path; // add the single
    }
    const { street, city, state, country, zip } = req.body;
    try {
      let address = await geoCoder.geocode(
        `${street} ${city} ${zip} ${state} ${country} `
      );
      let amenities = await req.body.amenities.split(",");

      const newListing = new Listing({
        ...req.body,
        address,
        images: imagesUris,
        amenities,
        host: req.user.id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      newListing.save();
      res.send(newListing);
    } catch (err) {
      console.log(err);
    }
  }
);

// PUT /listings/:id
//edit existing listing by id
listingRouter.put(
  "/:id",
  auth,
  parser.array("images"),
  async (req, res, next) => {
    const { id } = req.params;
    const imagesUris = [];
    if (req.files) {
      const files = req.files;
      files.map((file) => imagesUris.push(file.path));
    }
    if (req.file && req.file.path) {
      // if only one image uploaded
      imagesUris = req.file.path; // add the single
    }
    const { street, city, state, country, zip } = req.body;
    try {
      let address = await geoCoder.geocode(
        `${street} ${city} ${zip} ${state} ${country} `
      );
      let amenities = await req.body.amenities.split(",");
      const editedListing = {
        ...req.body,
        address,
        images: imagesUris,
        amenities,
        host: req.user.id,
        updatedAt: Date.now(),
      };
      const listingToEdit = await Listing.findByIdAndUpdate(id, editedListing);
      res.send({
        edited: listingToEdit._id,
        updatedAt: listingToEdit.updatedAt,
      });
    } catch (err) {
      console.log(err);
      const error = new Error("It was not possible to update the listing");
      error.code = 400;
      next(error);
    }
  }
);

// DELETE /listings/:id
//delete existing listing by id (or all id id===all)
listingRouter.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    if (id === "all") {
      await Listing.deleteMany();
      res.send({ msg: "deleted all" });
    } else {
      const listingToDelete = await Listing.findByIdAndDelete(id);
      res.send({
        deleted: listingToDelete,
        msg: "correctly deleted",
      });
    }
  } catch (err) {
    const error = new Error("It was not possible to update the listing");
    error.code = 400;
    next(error);
  }
});

//GET /listings/:id/bookings
//get all bookings for a listing by listing id
listingRouter.get("/:id/bookings", async (req, res, next) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ listing: id });
    res.send(bookings);
  } catch (err) {
    const error = new Error(
      "There is an error finding the booking for this listing"
    );
    error.code = 404;
    next(error);
  }
});

listingRouter.get("/search/city", async (req, res, next) => {
  try {
    const result = await geoCoder.geocode(req.query.city);
    const lat = result[0].latitude;
    const long = result[0].longitude;
    const cords1 = [long, lat];
    let results = await Listing.find();
    results = await results.filter((result) => result.address);
    results = results.filter(
      (loc) =>
        haversine(cords1, [loc.address[0].longitude, loc.address[0].latitude]) <
        40000
    );

    res.send(results);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

listingRouter.get("/search/results", async (req, res, next) => {
  try {
    const checkin = req.query.checkin && (await moment(req.query.checkin));
    const checkout = req.query.checkout && (await moment(req.query.checkout));

    const listings = await Listing.find().populate("bookings");
    let filterList = listings;

    if (req.query.city) {
      const coord = await geoCoder.geocode(req.query.city);
      const lat = coord[0].latitude;
      const long = coord[0].longitude;
      const cords1 = [long, lat];
      filterList = await listings.filter((result) => result.address);
      filterList = filterList.filter(
        (loc) =>
          haversine(cords1, [
            loc.address[0].longitude,
            loc.address[0].latitude,
          ]) < 40000
      );
    }
    if (req.query.checkin && req.query.checkout) {
      filterList = filterList.filter(
        (listing) =>
          listing.bookings.length == "" ||
          listing.bookings.some(
            (booking) =>
              !moment(checkin).isBetween(booking.checkin, booking.checkout) &&
              !moment(checkout).isBetween(booking.checkin, booking.checkout)
          )
      );
    }

    if (req.query.guests) {
      console.log(req.query.guests);
      filterList = filterList.filter(
        (listing) => listing.guests >= req.query.guests
      );
    }
    console.log(filterList);
    res.send(filterList);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = listingRouter;
