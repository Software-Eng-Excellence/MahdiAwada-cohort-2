import { Pool } from 'pg';
import config from '../../config';
export class ConnectionManager {
    public static pool: Pool;
    public static async getConnection() {
        if (!ConnectionManager.pool) {
      ConnectionManager.pool = new Pool({
        host: config.host,
        user: config.postgresql.user,
        password: config.postgresql.password,
        database: config.postgresql.database,
        port: config.postgresql.db_port,
      });
    }
    return ConnectionManager.pool;
  }
}