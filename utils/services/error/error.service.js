"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatError = require("apollo-errors");
const boom = require("boom");
exports.ErrorMessages = [
    {
        name: 'invalid-address',
        data: {
            en: {
                message: 'Invalid address provided'
            },
            bg: {
                message: 'Invalid address provided'
            }
        }
    },
    {
        name: 'not-enought-funds',
        data: {
            en: {
                message: 'Not enought funds in your wallet'
            },
            bg: {
                message: 'Not enought funds in your wallet'
            }
        }
    },
    {
        name: 'transaction-reverted',
        data: {
            en: {
                message: 'Transaction reverted'
            },
            bg: {
                message: 'Transaction reverted'
            }
        }
    },
    {
        name: 'unknown-error',
        data: {
            en: {
                message: 'Unknown error contact customer service with given eid'
            },
            bg: {
                message: 'Unknown error contact customer service with given eid'
            }
        }
    },
    {
        name: 'missing-wallet-id',
        data: {
            en: {
                message: 'Missing wallet id'
            },
            bg: {
                message: 'Missing wallet id'
            }
        }
    },
    {
        name: 'invalid-address-from',
        data: {
            en: {
                message: 'Invalid address from'
            },
            bg: {
                message: 'Invalid address from'
            }
        }
    },
    {
        name: 'invalid-address-to',
        data: {
            en: {
                message: 'Invalid address to'
            },
            bg: {
                message: 'Невалиден адрес до'
            }
        }
    },
    {
        name: 'invalid-user-name',
        data: {
            en: {
                message: 'Invalid email or password'
            },
            bg: {
                message: 'Невалиден имейл или парола'
            }
        }
    },
    {
        name: 'wrong-user-name-or-password',
        data: {
            en: {
                message: 'The username or password are incorrect.'
            },
            bg: {
                message: 'The username or password are incorrect.'
            }
        }
    },
    {
        name: 'unauthorized',
        data: {
            en: {
                message: 'You are unable to fetch data'
            },
            bg: {
                message: 'Нямате право да използвате този ресурс'
            }
        }
    },
    {
        name: 'account-not-found',
        data: {
            en: {
                message: 'Ethereum account not found'
            },
            bg: {
                message: 'Не е намерен Ethereum адрес'
            }
        }
    },
    {
        name: 'invalid-account-password',
        data: {
            en: {
                message: 'Ethereum wallet password is invalid'
            },
            bg: {
                message: 'Въведената парола за декриптиране на портфейла е невалидна'
            }
        }
    },
];
class ServerErrorsList {
    constructor() {
        this.errorsList = exports.ErrorMessages;
    }
    map(err) {
        return this.errorsList.filter(e => e.name === err)[0].name;
    }
}
exports.ServerErrorsList = ServerErrorsList;
// interface PrivateErrors {
//   eid: string;
// }
exports.attachErrorHandlers = formatError.formatError;
// <ApolloErrors>
exports.clientErrors = formatError;
// BoomErrorType
exports.Boom = boom;
function createError(name, message, data) {
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    data = data || {};
    data.eid = guid();
    message = `(${data.eid}): ${message}`;
    const error = exports.clientErrors.createError(name, { message, data });
    return new error();
}
exports.createError = createError;
exports.errorUnauthorized = function () {
    throw new createError('unauthorized', 'You are unable to fetch data');
};
function transactionError(e) {
    if (e.message.includes('invalid address') || e.message.includes(`indrect IBAN address which can't be converted`)) {
        throw new createError('invalid-address', e.message.substring(0, e.message.indexOf('at')), {
            rawMessage: e.message.substring(0, e.message.indexOf('at'))
        });
    }
    else if (e.message.includes('have enough funds to send tx')) {
        throw new createError('not-enought-funds', e.message.substring(0, e.message.indexOf('at')), {
            rawMessage: e.message.substring(0, e.message.indexOf('at'))
        });
    }
    else if (e.message.includes('VM Exception while processing transaction: revert')) {
        throw new createError('transaction-reverted', e.message);
    }
    else if (e.message.includes('could not unlock signer account')) {
        throw new createError('account-locked', e.message);
    }
    else {
        throw new createError('unknown-error', e.message.substring(0, e.message.indexOf('at')), e);
    }
}
exports.transactionError = transactionError;
