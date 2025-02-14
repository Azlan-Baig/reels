import { IVideo } from "@/Models/Video";
type videoFormData = Omit<IVideo, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async Fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };
    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }
  async getVideos() {
    return this.Fetch<IVideo[]>("/videos");
  }
  async getAVideo(id: string) {         
    return this.Fetch(`/videos/${id}`);
  }
  async createVideo(videoData: videoFormData) {
    return this.Fetch<IVideo>("/videos", { method: "POST", body: videoData });
  }
}


// takay har baar new object banaym naa ki same object k instances bantay rahein.
export const apiClient = new ApiClient();