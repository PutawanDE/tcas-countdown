interface Exam {
  name: string;
  year: number;
  month: number;
  day: number;
}


interface XPostTweetsResponse {
  data?: {
    id: string;
    text: string;
    edit_history_post_ids?: string[];
  };
  errors?: object[];
}