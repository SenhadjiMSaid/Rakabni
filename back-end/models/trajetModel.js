const mongoose = require("mongoose");

const trajetSchema = new mongoose.Schema(
  {
    Depart: {
      type: String,
      required: [true, "Vous devez ajouter un point de depart  "],
    },
    Arrivée: {
      type: String,
      required: [true, "Vous devez ajouter un point de d'arriver"],
    },
    Vehicule: {
      type: String,
      required: [true, "Vous devez preciser votre vehicule"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    Couleur: {
      type: String,
      required: [true, "Vous devez preciser la couleur de votre vehicule"],
      default: "Blanc",
      values: [
        "Blanc",
        "noir",
        "rouge",
        "orange",
        "blue",
        "gris",
        "jaune",
        "maron",
        "violet",
        "vert",
      ],
    },
    Matricule: {
      type: String,
      required: [true, "Vous devez preciser votre plaque d'immatriculation"],
    },

    places: {
      type: Number,
      required: [true, "Vous devez entrer le nobre de passager"],
    },
    fumers: {
      type: Boolean,
      default: false,
    },
    climatisation: {
      type: Boolean,
      default: false,
    },

    date: {
      type: Date,
      required: [true, "Vous devez ajouter date de depart"],
    },
    HeurD: {
      type: String,
      required: [true, "Vous devez ajouter une heur de départ"],
    },
    HeurA: {
      type: String,
      required: [true, "Vous devez ajouter une heur de d'arrivé"],
    },
    Prix: {
      type: Number,
      required: [true, "Vous devez ajouter un prix a votre trajet"],
    },
    Conducteur: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A driver is required"],
    },
    Passagers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    slug: {
      type: String,
      required: [
        true,
        "Vous devez ajouter le pseudo du conducteur pour le trajet",
      ],
    },
    Sexe: {
      type: String,
      required: [true, "Vous devez entrer le sexe de la personne"],
      values: ["Homme", "Femme"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

trajetSchema.pre(/^find/, function (next) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const currentHour = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();

  Trajet.updateMany(
    {
      $expr: {
        $or: [
          { $lt: [{ $year: "$date" }, currentYear] },
          {
            $and: [
              { $eq: [{ $year: "$date" }, currentYear] },
              { $lt: [{ $month: "$date" }, currentMonth] },
            ],
          },
          {
            $and: [
              { $eq: [{ $year: "$date" }, currentYear] },
              { $eq: [{ $month: "$date" }, currentMonth] },
              { $lt: [{ $dayOfMonth: "$date" }, currentDay] },
            ],
          },
          {
            $and: [
              { $eq: [{ $year: "$date" }, currentYear] },
              { $eq: [{ $month: "$date" }, currentMonth] },
              { $eq: [{ $dayOfMonth: "$date" }, currentDay] },
              { $lt: [{ $toInt: { $substr: ["$HeurD", 0, 2] } }, currentHour] },
            ],
          },
          {
            $and: [
              { $eq: [{ $year: "$date" }, currentYear] },
              { $eq: [{ $month: "$date" }, currentMonth] },
              { $eq: [{ $dayOfMonth: "$date" }, currentDay] },
              { $eq: [{ $toInt: { $substr: ["$HeurD", 0, 2] } }, currentHour] },
              {
                $lt: [
                  { $toInt: { $substr: ["$HeurD", 3, 2] } },
                  currentMinutes,
                ],
              },
            ],
          },
        ],
      },
    },
    { $set: { isActive: false } },
    (err, result) => {
      if (err) {
        console.error(err);
      }
    }
  );

  next();
});

trajetSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "conducteur",
  localField: "Conducteur",
});

trajetSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

const Trajet = mongoose.model("Trajet", trajetSchema);
module.exports = Trajet;
