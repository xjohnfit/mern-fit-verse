export interface UserProfile {
    _id: string;
    name: string;
    username: string;
    email: string;
    dob: string;
    gender: string;
    followers: Array<{
        _id: string;
        name: string;
        username: string;
        photo?: string;
    }>;
    following: Array<{
        _id: string;
        name: string;
        username: string;
        photo?: string;
    }>;
    height?: number;
    weight?: number;
    weightUnit?: string;
    goal?: string;
    photo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Post {
    _id: string;
    user: {
        _id: string;
        name: string;
        username: string;
        photo?: string;
    };
    content: string;
    image?: string;
    likes: string[];
    comments: Array<{
        _id: string;
        user: {
            _id: string;
            name: string;
            username: string;
            photo?: string;
        };
        comment: string;
        createdAt: string;
    }>;
    createdAt: string;
    updatedAt: string;
}
