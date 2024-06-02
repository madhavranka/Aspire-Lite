abstract class DatabaseTable<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  public abstract save(data: T): Promise<T>;

  public abstract update(
    whereCondition: T,
    data: Partial<T>
  ): Promise<T | null>;

  public abstract get(id: number): Promise<T | null>;

  protected getTableName(): string {
    return this.tableName;
  }
}

export default DatabaseTable;
