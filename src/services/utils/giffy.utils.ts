import { giphyService } from '@services/api/giffy/giffy';

export class GiphyUtils {
  static async getTrendingGifs(setGifs: any, setLoading: (arg: boolean) => void) {
    setLoading(true);
    try {
      const response = await giphyService.trending();
      setGifs(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  static async searchGifs(gif: any, setGifs: any, setLoading: (arg: boolean) => void) {
    if (gif.length <= 1) {
      GiphyUtils.getTrendingGifs(setGifs, setLoading);
      return;
    }
    setLoading(true);
    try {
      const response = await giphyService.search(gif);
      setGifs(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }
}
