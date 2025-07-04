import axios from 'axios'

import type {
  BountyParamType,
  CodeParamType,
  InfraParamType,
  PublishType as PublishParamType,
  SocialParamType,
  TagParamType,
  VideoParamType
} from '@/types/valueTypes';

// auth-related apis
export async function getSession() {
  const res = await axios.get("/api/auth/session");

  return res.data?.session;
}

export async function loginSimulate() {
  try {
    await axios.post('/api/auth',
      { iaddress: 'iKX5wGESZQFRQzhTV7dYGdsXq2o3uwyTd1', name: 'CCC.bitcoins@' }
    );
  } catch (error: any) {
    throw error;
  }
}

export async function requestLogin() {
  const res = await axios.post('/api/auth/login');

  return res.data;
}

export async function cancelLogin(challenge: string) {
  const res = await axios.delete('/api/auth/login', { data: { challenge } });

  return res.data;
}

export async function checkLogin(challenge: string) {
  const res = await axios.put('/api/auth/login', { challenge });

  return res.data?.verus;
}

export async function logoutUser() {
  await axios.delete('/api/auth/session');
}

// infra-related api
export async function createInfra(params: InfraParamType) {
  try {
    await axios.post('/api/infra', params);
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function getInfraList() {
  try {
    const resp = await axios.get('/api/infra');

    return resp.data?.infra;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// video-related api for admin
export async function getInfraListForAdmin() {
  try {
    const resp = await axios.get('/api/admin/infra');

    return resp.data?.infra;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function publishInfraForAdmin(id: string, params: PublishParamType) {
  try {
    await axios.post(`/api/admin/infra/${id}`, params);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function changeInfraForAdmin(id: string, params: CodeParamType) {
  try {
    await axios.put(`/api/admin/infra/${id}`, params);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function weighInfraForAdmin(id: string, weight: number) {
  try {
    await axios.patch(`/api/admin/infra/${id}`, { weight });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function deleteInfraForAdmin(id: string) {
  try {
    await axios.delete(`/api/admin/infra/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// infra-related api for current user
export async function getInfraListForUser() {
  try {
    const resp = await axios.get('/api/me/infra');

    return resp.data?.infra;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function deleteInfraForUser(id: string) {
  try {
    await axios.delete(`/api/me/infra/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// video-related api
export async function createVideo(params: VideoParamType) {
  try {
    await axios.post('/api/video', params);
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function getVideoList() {
  try {
    const resp = await axios.get('/api/video');

    return resp.data?.videos;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// video-related api for admin
export async function getVideoListForAdmin() {
  try {
    const resp = await axios.get('/api/admin/video');

    return resp.data?.videos;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function publishVideoForAdmin(id: string, params: PublishParamType) {
  try {
    await axios.post(`/api/admin/video/${id}`, params);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function changeVideoForAdmin(id: string, params: CodeParamType) {
  try {
    await axios.put(`/api/admin/video/${id}`, params);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function weighVideoForAdmin(id: string, weight: number) {
  try {
    await axios.patch(`/api/admin/video/${id}`, { weight });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function deleteVideoForAdmin(id: string) {
  try {
    await axios.delete(`/api/admin/video/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}


// video-related api for current user
export async function getVideoListForUser() {
  try {
    const resp = await axios.get('/api/me/video');

    return resp.data?.videos;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function deleteVideoForUser(id: string) {
  try {
    await axios.delete(`/api/me/video/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// code-related api
export async function createCode(params: CodeParamType) {
  try {
    await axios.post('/api/code', params);
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function getCodeList() {
  try {
    const resp = await axios.get('/api/code');

    return resp.data?.codes;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// code-related api for admin
export async function getCodeListForAdmin() {
  try {
    const resp = await axios.get('/api/admin/code');

    return resp.data?.codes;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function publishCodeForAdmin(id: string, params: PublishParamType) {
  try {
    await axios.post(`/api/admin/code/${id}`, params);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function changeCodeForAdmin(id: string, params: CodeParamType) {
  try {
    await axios.put(`/api/admin/code/${id}`, params);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function weighCodeForAdmin(id: string, weight: number) {
  try {
    await axios.patch(`/api/admin/code/${id}`, { weight });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function deleteCodeForAdmin(id: string) {
  try {
    await axios.delete(`/api/admin/code/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// code-related api for current user
export async function getCodeListForUser() {
  try {
    const resp = await axios.get('/api/me/code');

    return resp.data?.codes;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function deleteCodeForUser(id: string) {
  try {
    await axios.delete(`/api/me/code/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// Tag related api calls
export async function createTagForAdmin(params: TagParamType) {
  await axios.post('/api/admin/tag', params);
}

export async function updateTagForAdmin(tagId: string, params: TagParamType) {
  await axios.put(`/api/admin/tag/${tagId}`, params);
}

export async function getTagList() {
  const resp = await axios.get('/api/tag');

  return resp.data?.tags;
}

export async function deleteTagForAdmin(id: string) {
  await axios.delete(`/api/admin/tag/${id}`);
}

// bounty-related api
export async function createBounty(params: BountyParamType) {
  try {
    await axios.post('/api/bounty', params);
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function createComment(bountyId: string, comment: string) {
  try {
    await axios.post(`/api/bounty/${bountyId}/comment`, { text: comment });
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function reportComment(commentId: string) {
  try {
    await axios.post(`/api/comment/${commentId}`);
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function getCommentList(bountyId: string) {
  try {
    const resp = await axios.get(`/api/bounty/${bountyId}/comment`);

    return resp.data?.comments;
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function getCommentListForAdmin() {
  try {
    const resp = await axios.get(`/api/admin/comment`);

    return resp.data?.comments;
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function publishCommentForAdmin(id: string) {
  try {
    await axios.post(`/api/admin/comment/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function deleteCommentForAdmin(id: string) {
  try {
    await axios.delete(`/api/admin/comment/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// export async function changeCommentForUser(id: string, params: CommentParamsType) {
//   try {
//     await axios.put(`/api/me/comment/${id}`, params);
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || error.message)
//   }
// }

// export async function getCommentListForUser() {
//   try {
//     const resp = await axios.get(`/api/me/comment`);

//     return resp.data?.comments;
//   } catch (error: any) {
//     if (error?.response?.data?.message)
//       throw new Error(error?.response?.data?.message)
//     throw error;
//   }
// }

// export async function deleteCommentForUser(id: string) {
//   try {
//     await axios.delete(`/api/me/comment/${id}`);
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || error.message)
//   }
// }

export async function getHistoryList(bountyId: string) {
  try {
    const resp = await axios.get(`/api/bounty/${bountyId}/history`);

    return resp.data?.history;
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function getBountyList({ search, sort, tags, status }: { search: string, sort: string, tags: string[], status: number }) {
  try {
    const resp = await axios.get('/api/bounty', { params: { search, sort, tags: tags.join(","), status } });

    return resp.data?.bounties || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function getBountyDetail(id: string) {
  try {
    const resp = await axios.get(`/api/bounty/${id}`);

    return resp.data?.bounty;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// video-related api for admin
export async function getBountyListForAdmin() {
  try {
    const resp = await axios.get('/api/admin/bounty');

    return resp.data?.bounties || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function publishBountyForAdmin(id: string, params: PublishParamType) {
  try {
    await axios.post(`/api/admin/bounty/${id}`, params);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function changeBountyForAdmin(id: string, params: BountyParamType) {
  try {
    await axios.put(`/api/admin/bounty/${id}`, params);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function weighBountyForAdmin(id: string, weight: number) {
  try {
    await axios.patch(`/api/admin/bounty/${id}`, { weight });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}


export async function deleteBountyForAdmin(id: string) {
  try {
    await axios.delete(`/api/admin/bounty/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// video-related api for current user
export async function getBountyListForUser() {
  try {
    const resp = await axios.get('/api/me/bounty');

    return resp.data?.bounties || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function changeBountyForUser(id: string, params: BountyParamType) {
  try {
    await axios.put(`/api/me/bounty/${id}`, params);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function completeBountyForUser(id: string) {
  try {
    await axios.post(`/api/me/bounty/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function assignBountyForUser(id: string, assignee: string) {
  try {
    await axios.patch(`/api/me/bounty/${id}`, { assignee });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function deleteBountyForUser(id: string) {
  try {
    await axios.delete(`/api/me/bounty/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// export async function checkVerus() {
//   try {
//     await axios.post('/api/auth/verus')
//   } catch (e) {

//   }
// }

// User related apis
export async function getUserList() {
  const resp = await axios.get('/api/user');

  return resp.data?.users;
}

export async function getUserListForAdmin() {
  const resp = await axios.get('/api/admin/user');

  return resp.data?.users;
}

export async function setUserRoleForAdmin(userId: string, isAdmin: boolean) {
  await axios.put(`/api/admin/user/${userId}`, { isAdmin });
}


// video-related api
export async function createSocial(params: SocialParamType) {
  try {
    await axios.post('/api/social', params);
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function getSocialList() {
  try {
    const resp = await axios.get('/api/social');

    return resp.data?.socials;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

// video-related api for admin
export async function getSocialListForAdmin() {
  try {
    const resp = await axios.get('/api/admin/social');

    return resp.data?.socials;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function publishSocialForAdmin(id: string, params: PublishParamType) {
  try {
    await axios.post(`/api/admin/social/${id}`, params);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function changeSocialForAdmin(id: string, params: CodeParamType) {
  try {
    await axios.put(`/api/admin/social/${id}`, params);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function weighSocialForAdmin(id: string, weight: number) {
  try {
    await axios.patch(`/api/admin/social/${id}`, { weight });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function deleteSocialForAdmin(id: string) {
  try {
    await axios.delete(`/api/admin/social/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}


// video-related api for current user
export async function getSocialListForUser() {
  try {
    const resp = await axios.get('/api/me/social');

    return resp.data?.socials;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}

export async function deleteSocialForUser(id: string) {
  try {
    await axios.delete(`/api/me/social/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message)
  }
}
