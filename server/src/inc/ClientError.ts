export class ClientError extends Error {
    error: string;
    description: string | undefined;

    constructor(error: string, description?: string) {
        super(error);
        this.error = error;
        this.description = description;
    }
}