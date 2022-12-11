import joi from "joi";

const customerSchema = joi.object({
    name: joi.string().min(1).required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().regex(/^[0-9]/).length(11).required(),
    birthday: joi.date().required()
});

export function customerValidation(req, res, next){
    const customer = req.body;

    const validationError = customerSchema.validate(customer, {
        abortEarly: false,
    }).error;

    if(validationError){
        const error = validationError.details.map((e) => e.message);
        return res.status(400).send(error);
    }

    next();
}