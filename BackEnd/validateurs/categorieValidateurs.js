const Joi = require('joi');

const categorieSchema = Joi.object({
    nom: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.base': 'Le nom de la catégorie doit être une chaîne de caractères',
            'string.empty': 'Le nom de la catégorie est obligatoire',
            'string.min': 'Le nom de la catégorie doit contenir au moins 2 caractères',
            'string.max': 'Le nom de la catégorie ne doit pas dépasser 50 caractères',
            'any.required': 'Le nom de la catégorie est obligatoire'
        }),

    description: Joi.string()
        .max(300)
        .allow('', null)
        .messages({
            'string.base': 'La description doit être une chaîne de caractères',
            'string.max': 'La description ne doit pas dépasser 300 caractères'
        }),
});

module.exports = { categorieSchema };
