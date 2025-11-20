export interface SuggestedUser {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

export interface FollowedUser {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

export interface PostUser {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

export interface Comment {
    _id: string;
    user: PostUser;
    comment: string;
    createdAt: string;
}

export interface Post {
    _id: string;
    user: PostUser;
    content: string;
    image?: string;
    likes: string[];
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
}

export interface NutritionTotals {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface NutritionData {
    data: {
        totals: NutritionTotals;
    };
}
