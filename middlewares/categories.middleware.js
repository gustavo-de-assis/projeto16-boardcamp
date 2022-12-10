import joi from "joi";

const categorySchema = joi.object({
    name: joi.string().min(3).required()
});

export function categoryValidation(req, res, next){
    const category = req.body;

    const validationError = categorySchema.validate(category, {
        abortEarly: false,
    }).error;

    if(validationError){
        const error = validationError.details.map((e) => e.message);
        return res.status(422).send(error);
    }

    next();
}