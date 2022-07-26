import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { 
  useGetAllPostsQuery, 
  useGetPostByIdQuery, 
  useDeletePostByIdMutation } from '../../redux/api/posts.api';
import { 
  setPostList,
  deletePost,
  setPostListById } from '../../redux/reducers/posts/posts.reducer';
import {
  toggleAddModal,
  toggleEditModal,
  updatePostsEditPostId,
  updatePostsNewPost, 
  updatePostsSearchId,
  updatePostsSkip} from '../../redux/reducers/ui.reducer';
import Modal from './components/Modal';
import { PostEntity } from '../../redux/reducers/posts/Posts.type';
import * as Styled from './Home.styles';

const Home = () => {
  const dispatch = useAppDispatch();
  const postsData = useAppSelector<any>(state => state.posts);
  const addModalToggle = useAppSelector(state => state.ui.posts.addModalToggle)
  const editModalToggle = useAppSelector(state => state.ui.posts.editModalToggle)
  const searchId = useAppSelector(state => state.ui.posts.searchId)
  const skip = useAppSelector(state => state.ui.posts.skip)
  const {data} = useGetAllPostsQuery();
  const [deletePostMutationById] = useDeletePostByIdMutation();
  const {data: postData} = useGetPostByIdQuery(searchId, { skip });

  useEffect(() => {
    if(data && !searchId){
      dispatch(setPostList(data))
    }
  }, [data, dispatch, searchId]);

  useEffect(() => {
    if (postData && searchId) {
        dispatch(setPostListById([postData]));
    }
  }, [dispatch, postData, searchId])
  
  const handleToggleAddModal = () => {
    dispatch(toggleAddModal(!addModalToggle))
  }

  const handleToggleEditModal = (post: PostEntity) => {
    dispatch((updatePostsEditPostId({id: post.id, userId: post.userId})));
    dispatch((updatePostsNewPost({title: post.title, body: post.body})));
    dispatch(toggleEditModal(!editModalToggle));
  }
  
  const handleSearchIdChange = (event: any) => {
    if(event.target.value === "") {
      dispatch(updatePostsSkip(true))
      dispatch(updatePostsSearchId(0))
    } else {
      dispatch(updatePostsSkip(false))
      dispatch(updatePostsSearchId(event.target.value))
    }
  };

  const handleDeletePost = (id: number) => {
    deletePostMutationById(id)
    .unwrap()
    .then(() => {
      dispatch(deletePost(id))})
  };

  return (
    <>
      {(addModalToggle || editModalToggle) && (
        <Modal 
        />
      )}
      {postsData.length && (
        <>
          <Styled.Header>
            <Styled.AddPostButtonContainer>
              <Styled.AddPostButton onClick={handleToggleAddModal}>Add Posts</Styled.AddPostButton>
            </Styled.AddPostButtonContainer>
            <Styled.SearchBarContainer>
              <Styled.SearchFormContainer>
                <form>
                  <Styled.Input
                    type="number"
                    placeholder="Search Id.."
                    name="searchId"
                    value={searchId === 0 ? '' : searchId}
                    onChange={handleSearchIdChange}
                    >
                  </Styled.Input>
                </form>
              </Styled.SearchFormContainer>
            </Styled.SearchBarContainer>
          </Styled.Header>
          <Styled.Table>
            <Styled.TableHead>
              <Styled.TableRow>
                <Styled.TableHeader>Id</Styled.TableHeader>
                <Styled.TableHeader>Title</Styled.TableHeader>
                <Styled.TableHeader>Post</Styled.TableHeader>
                <Styled.TableHeader>Edit</Styled.TableHeader>
                <Styled.TableHeader>Delete</Styled.TableHeader>
              </Styled.TableRow>
            </Styled.TableHead>
            <Styled.TableBody>
              {postsData.map((post: any) => {
                return (
                  <Styled.TableRow key={post.id}>
                    <Styled.TableDetail>{post.id}</Styled.TableDetail>
                    <Styled.TableDetail>{post.title}</Styled.TableDetail>
                    <Styled.TableDetail>{post.body}</Styled.TableDetail>
                    <Styled.TableDetail>
                      <Styled.EditButton onClick={() => handleToggleEditModal(post)}>Edit</Styled.EditButton>
                    </Styled.TableDetail>
                    <Styled.TableDetail>
                      <Styled.DeleteButton onClick={() => handleDeletePost(post.id)}>Delete</Styled.DeleteButton>
                    </Styled.TableDetail>
                  </Styled.TableRow>
                )
              })}
            </Styled.TableBody>
          </Styled.Table>
        </>
      )}
    </>
  )
}

export default Home;
