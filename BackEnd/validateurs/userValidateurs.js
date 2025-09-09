const Joi = require('joi');

const userSchema = Joi.object({
    nom: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.base': 'Le nom doit être une chaîne de caractères',
            'string.empty': 'Le nom est obligatoire',
            'string.min': 'Le nom doit contenir au moins 2 caractères',
            'string.max': 'Le nom ne doit pas dépasser 50 caractères',
            'any.required': 'Le nom est obligatoire'
        }),
    
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Veuillez entrer un email valide',
            'string.empty': 'L\'email est obligatoire',
            'any.required': 'L\'email est obligatoire'
        }),
    
    motDePasse: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
            'string.empty': 'Le mot de passe est obligatoire',
            'any.required': 'Le mot de passe est obligatoire'
        }),
    
    role: Joi.string()
        .valid('admin', 'utilisateur')
        .messages({
            'any.only': 'Le rôle doit être admin ou utilisateur',
            'string.base': 'Le rôle doit être une chaîne de caractères'
        })
});

const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Veuillez entrer un email valide',
            'string.empty': 'L\'email est obligatoire',
            'any.required': 'L\'email est obligatoire'
        }),
    
    motDePasse: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
            'string.empty': 'Le mot de passe est obligatoire',
            'any.required': 'Le mot de passe est obligatoire'
        })
});

module.exports = { userSchema, loginSchema };
