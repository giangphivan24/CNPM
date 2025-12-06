import axiosClient from './axiosClient';

export interface SubmissionData {
  assignmentId: string;
  file: File;
  comment?: string;
}

// Nộp bài
export const createSubmission = async (data: SubmissionData): Promise<any> => {
  const formData = new FormData();
  formData.append('assignmentId', data.assignmentId);
  formData.append('file', data.file);
  if (data.comment) {
    formData.append('comment', data.comment);
  }

  const response = await axiosClient.post('/submissions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Lấy danh sách bài nộp của tôi
export const fetchMySubmissions = async (): Promise<any[]> => {
  const response = await axiosClient.get('/submissions/my');
  return response.data;
};

// Lấy chi tiết bài nộp
export const fetchSubmissionById = async (id: string): Promise<any> => {
  const response = await axiosClient.get(`/submissions/${id}`);
  return response.data;
};
