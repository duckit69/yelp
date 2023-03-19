const baseJoi = require("joi");
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) {
                    return helpers.error('string.escapeHTML', {value})
                }
            }
        }
    }
});

const joi = baseJoi.extend(extension);

module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        // images: joi.array().required(),
        description: joi.string().required(),
        location: joi.string().required()
    }).required(),
    deleteImages: joi.array()
});


module.exports.reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().required().min(1).max(5)
    }).required()
});

module.exports.userSchema = joi.object({
    user: joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        email: joi.string().required()
    }).required()
});