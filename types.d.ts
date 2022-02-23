declare namespace Express {
    export interface Request {
        user?: {
            name: string;
            email: string;
            passwordHash?: string;
            phone?: string;
            document?: string;
            isAdmin?: boolean;
            street?: string;
            apartment?: string;
            zip?: string;
            city?: string;
            country?: string;
            cart?: string;
            shippingAdress?: string;
            activation?: boolean;
            favorites:  string[];
            refreshToken?: any[];
            authStrategy?: string;
            _id: string;
        }
    }
}