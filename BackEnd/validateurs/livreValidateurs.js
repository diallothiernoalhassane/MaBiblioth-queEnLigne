const Joi = require('joi');

const livreSchema = Joi.object({
    titre: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.base': 'Le titre doit être une chaîne de caractères',
            'string.empty': 'Le titre est obligatoire',
            'string.min': 'Le titre doit contenir au moins 2 caractères',
            'string.max': 'Le titre ne doit pas dépasser 100 caractères',
            'any.required': 'Le titre est obligatoire'
        }),

    auteur: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.base': 'Le nom de l\'auteur doit être une chaîne de caractères',
            'string.empty': 'Le nom de l\'auteur est obligatoire',
            'string.min': 'Le nom de l\'auteur doit contenir au moins 2 caractères',
            'string.max': 'Le nom de l\'auteur ne doit pas dépasser 50 caractères',
            'any.required': 'Le nom de l\'auteur est obligatoire'
        }),

    description: Joi.string()
        .max(500)
        .allow('', null)
        .messages({
            'string.base': 'La description doit être une chaîne de caractères',
            'string.max': 'La description ne doit pas dépasser 500 caractères'
        }),

    categorieId: Joi.string()
        .required()
        .messages({
            'string.base': 'La catégorie doit être une chaîne de caractères',
            'string.empty': 'La catégorie est obligatoire',
            'any.required': 'La catégorie est obligatoire'
        }),

    fichierPdf: Joi.string()
        .required()
        .messages({
            'string.base': 'Le fichier PDF doit être une chaîne de caractères',
            'string.empty': 'Le fichier PDF est obligatoire',
            'any.required': 'Le fichier PDF est obligatoire'
        }),

    imageCouverture: Joi.string()
        .required()
        .messages({
            'string.base': 'L\'image de couverture doit être une chaîne de caractères',
            'string.empty': 'L\'image de couverture est obligatoire',
            'any.required': 'L\'image de couverture est obligatoire'
        }),
});

module.exports = { livreSchema };
