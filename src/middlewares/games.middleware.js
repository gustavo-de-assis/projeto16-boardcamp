import joi from "joi";

const gameSchema = joi.object({
    name: joi.string().min(1).required(),
    image: joi.string().min(0),
    stockTotal: joi.number().min(1).required(),
    pricePerDay: joi.number().min(1).required(),
    categoryId: joi.number().required()
});

export function gameValidation(req, res, next){
    const game = req.body;

    const validationError = gameSchema.validate(game, {
        abortEarly: false,
    }).error;

    if(validationError){
        const error = validationError.details.map((e) => e.message);
        return res.status(400).send(error);
    }

    next();
}