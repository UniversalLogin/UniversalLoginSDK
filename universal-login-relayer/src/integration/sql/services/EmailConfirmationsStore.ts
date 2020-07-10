import Knex from 'knex';
import {EmailConfirmation, ensureNotFalsy} from '@unilogin/commons';
import {EmailNotFound} from '../../../core/utils/errors';

export class EmailConfirmationsStore {
  private tableName = 'email_confirmations';

  constructor(private database: Knex) {
  }

  async add(emailConfirmation: EmailConfirmation) {
    const {createdAt, ...rest} = emailConfirmation;
    return (await this.database(this.tableName)
      .insert({...rest, created_at: createdAt})
      .returning('email'))[0];
  }

  async get(email: string): Promise<EmailConfirmation> {
    const emailConfirmation = await this.database(this.tableName)
      .select(['email', 'ensName', 'code', 'created_at', 'isConfirmed'])
      .where('email', email)
      .orderBy('created_at', 'desc')
      .first();
    ensureNotFalsy(emailConfirmation, EmailNotFound, email);
    const {created_at, ...rest} = emailConfirmation;
    return {...rest, createdAt: created_at};
  }

  async updateIsConfirmed({createdAt, email}: EmailConfirmation, isConfirmed: boolean) {
    return this.database(this.tableName)
      .update({isConfirmed})
      .where({
        email,
        created_at: createdAt,
      });
  }
}