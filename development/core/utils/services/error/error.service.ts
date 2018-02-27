import * as formatError from 'apollo-errors';
import * as boom from 'boom';

// tslint:disable-next-line:max-line-length
export type errorsType =

// Ethereum Send Transaction Errors
| 'invalid-address'
| 'not-enought-funds'
| 'transaction-reverted'
| 'account-locked'
| 'unknown-error'
| 'missing-wallet-id'
| 'unauthorized'
| 'invalid-user-name'
| 'invalid-address-to'
| 'invalid-address-from'
| 'wrong-user-name-or-password'
| 'account-not-found'
| 'invalid-account-password'


;









export interface ServerErrors {
    name: errorsType;
    data: { bg: { message: string }, en: { message: string } };
}

export const ErrorMessages: ServerErrors[] = [
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


export class ServerErrorsList {

    errorsList: ServerErrors[] = ErrorMessages;

    map(err: errorsType): string {
        return this.errorsList.filter(e => e.name === err)[0].name;
    }

}


interface ApolloErrors {
  createError(name: string, config: any);
  formatError(error);
  isInstance(e);
}

// interface PrivateErrors {
//   eid: string;
// }
export const attachErrorHandlers = formatError.formatError;
// <ApolloErrors>
export const clientErrors = formatError;

interface BoomErrorType {
  unauthorized(string?: string): any;
}
// BoomErrorType
export const Boom = boom;

export function createError(name: errorsType, message: string, data?: any): void {
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
  const error = clientErrors.createError(name, { message, data });
  return new error();
}

export const errorUnauthorized = function () {
  throw new createError('unauthorized', 'You are unable to fetch data');
};


export function transactionError(e) {
  if (e.message.includes('invalid address') || e.message.includes(`indrect IBAN address which can't be converted`)) {
    throw new createError('invalid-address', e.message.substring(0, e.message.indexOf('at')), {
      rawMessage: e.message.substring(0, e.message.indexOf('at'))
    });
  } else if (e.message.includes('have enough funds to send tx')) {
    throw new createError('not-enought-funds', e.message.substring(0, e.message.indexOf('at')), {
      rawMessage: e.message.substring(0, e.message.indexOf('at'))
    });
  } else if (e.message.includes('VM Exception while processing transaction: revert')) {
    throw new createError('transaction-reverted', e.message);
  } else if (e.message.includes('could not unlock signer account')) {
    throw new createError('account-locked', e.message);
  } else {
    throw new createError('unknown-error', e.message.substring(0, e.message.indexOf('at')), e);
  }
}
