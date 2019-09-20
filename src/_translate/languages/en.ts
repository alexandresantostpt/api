const messages = {
    en: {
        translations: {
            messages: {
                passwordNotMatch: "Old password doesn't match with the current one",
                places: {
                    unauthorized: 'Places service API has been returned unauthorized response error'
                },
                services: {
                    weather: {
                        unauthorized: 'Weather service API has been returned unauthorized response error'
                    }
                },
                unauthorized: 'User or password invalid',
                userRepeated: 'Travel already shared with this user'
            },
            validations: {
                checkOutHour: 'Checkout hour must be after checkin hour',
                email: 'is not a valid email',
                finalDate: 'Final date must be after initial',
                postalCode: 'is not a valid postal code',
                serviceDateNotInBetween: 'Service date must be in travel range date',
                versionAttribute: 'Must be a version attribute'
            }
        }
    }
}

export { messages }
