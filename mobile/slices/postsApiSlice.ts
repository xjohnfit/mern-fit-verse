import { apiSlice } from './apiSlice';

const BASE_URL = '/posts';

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //Get feed posts -  returns all posts in the collection
        getPosts: builder.query({
            query: () => ({
                url: `${BASE_URL}/feed`,
                method: 'GET',
            }),
            providesTags: ['Posts'],
        }),

        //Get followed users posts
        getFollowedUsersPosts: builder.query({
            query: () => ({
                url: `${BASE_URL}/feed/followed`,
                method: 'GET',
            }),
            providesTags: ['Posts'],
        }),

        // Get specific user posts
        getUserPosts: builder.query({
            query: (username) => ({
                url: `${BASE_URL}/user/${username}`,
                method: 'GET',
            }),
            providesTags: ['Posts'],
        }),

        // Create Post
        createPost: builder.mutation({
            query: (post) => ({
                url: `${BASE_URL}/create`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: ['Posts'],
        }),

        // Delete Post
        deletePost: builder.mutation({
            query: (postId) => ({
                url: `${BASE_URL}/delete/${postId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Posts'],
        }),

        // Like/Unlike Post
        likeUnlikePost: builder.mutation({
            query: (postId) => ({
                url: `${BASE_URL}/like/${postId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Posts'],
        }),

        // Add Comment
        addComment: builder.mutation({
            query: ({ postId, comment }) => ({
                url: `${BASE_URL}/comment/${postId}`,
                method: 'POST',
                body: { comment },
            }),
            invalidatesTags: ['Posts'],
        }),

        // Delete Comment
        deleteComment: builder.mutation({
            query: ({ postId, commentId }) => ({
                url: `${BASE_URL}/comment/${postId}/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Posts'],
        }),
    }),
});

export const {
    useGetPostsQuery,
    useGetFollowedUsersPostsQuery,
    useGetUserPostsQuery,
    useCreatePostMutation,
    useDeletePostMutation,
    useLikeUnlikePostMutation,
    useAddCommentMutation,
    useDeleteCommentMutation,
} = postsApiSlice;
