import { apiSlice } from './apiSlice';
const BASE_URL =
    import.meta.env.MODE === 'development'
        ? 'http://localhost:5003/api'
        : '/api';

export const postsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //Get feed posts -  returns all posts in the collection
        getPosts: builder.query({
            query: () => ({
                url: `${BASE_URL}/posts/feed`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['Posts'],
        }),

        //Get followed users posts
        getFollowedUsersPosts: builder.query({
            query: () => ({
                url: `${BASE_URL}/posts/feed/followed`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['Posts'],
        }),

        // Get specific user posts
        getUserPosts: builder.query({
            query: (username) => ({
                url: `${BASE_URL}/posts/user/${username}`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['Posts'],
        }),

        // Create Post
        createPost: builder.mutation({
            query: (post) => ({
                url: `${BASE_URL}/posts/create`,
                method: 'POST',
                credentials: 'include',
                body: post,
            }),
            invalidatesTags: ['Posts'],
        }),

        // Delete Post
        deletePost: builder.mutation({
            query: (postId) => ({
                url: `${BASE_URL}/posts/delete/${postId}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['Posts'],
        }),

        // Like/Unlike Post
        likeUnlikePost: builder.mutation({
            query: (postId) => ({
                url: `${BASE_URL}/posts/like/${postId}`,
                method: 'POST',
                credentials: 'include',
            }),
            invalidatesTags: ['Posts'],
        }),

        // Add Comment
        addComment: builder.mutation({
            query: ({ postId, comment }) => ({
                url: `${BASE_URL}/posts/comment/${postId}`,
                method: 'POST',
                credentials: 'include',
                body: { comment },
            }),
            invalidatesTags: ['Posts'],
        }),

        // Delete Comment
        deleteComment: builder.mutation({
            query: ({ postId, commentId }) => ({
                url: `${BASE_URL}/posts/comment/${postId}/${commentId}`,
                method: 'DELETE',
                credentials: 'include',
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
