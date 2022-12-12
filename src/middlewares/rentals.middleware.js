import joi from "joi";

const rentalSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().min(1).required()
});

export function rentalValidation(req, res, next){
    const rental = req.body;

    const validationError = rentalSchema.validate(rental, {
        abortEarly: false,
    }).error;

    if(validationError){
        const error = validationError.details.map((e) => e.message);
        return res.status(400).send(error);
    }

    next();
}