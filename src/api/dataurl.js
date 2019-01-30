/**
 * Created by 大白胡子 on 2017/6/9.
 */
import {API_ROOT} from './config.js'

const apiMusic = {
  recommendList: "/personalized",                  //推荐的歌单，没有参数
  recommendMv: "/personalized/mv",                 //推荐的mv,没有参数
  exclusivePush: "/personalized/privatecontent",   //独家推送,没有参数
  fineSong: "/top/playlist/highquality",           //获取精品歌单，参数?limit=30;
  songDetails: "/playlist/detail",                 //获取歌单详细信息，参数?id=;歌单的id
  musicDetails: "/song/detail",                   //获取音乐的详细信息，参数?ids= , /*多个参数用逗号隔开*/
  musicUrl: "/song/url",                          //获取音乐的url，参数?id= , /*多个参数用逗号隔开*/
  searchMusic: "/search",                          //搜索音乐，参数?keywords=;可以是汉字
  lyricsMusic: "/lyric",                           //获取音乐的歌词，参数?id=;音乐的id
  musicComment: "/comment/music",                  //获取音乐的评论，参数?id=;音乐的id
  songComment: "/comment/playlist",                //获取歌单的评论，参数?id=;音乐的id
  bannerUrl: "/banner",                            //获取banner图片及地址
  musicAlbum: "/album",                            //获取专辑信息,参数?id=;专辑的id
  artistSinger: "/artists",                        //获取歌手的所有音乐,参数?id=;歌手的id
  artistMv: "/artist/mv",                          //获取歌手的所有mv,参数?id=;歌手的id
  artistAlbum: "/artist/album",                    //获取歌手的所有专辑,参数?id=;歌手的id
  musicMv: "/mv",                                  //获取MV,参数?mvid=
  artistDescribe: "/artist/desc",                  //歌手描述，参数?id=;歌手id
  rankingList: "/top/list"                         //排行榜
  /*
   * "0": 云音乐新歌榜,
     "1": 云音乐热歌榜,
     "2": 网易原创歌曲榜,
     "3": 云音乐飙升榜,
     "4": 云音乐电音榜,
     "5": UK排行榜周榜,
     "6": 美国Billboard周榜
     "7": KTV嗨榜,
     "8": iTunes榜,
     "9": Hit FM Top榜,
     "10": 日本Oricon周榜
     "11": 韩国Melon排行榜周榜,
     "12": 韩国Mnet排行榜周榜,
     "13": 韩国Melon原声周榜,
     "14": 中国TOP排行榜(港台榜),
     "15": 中国TOP排行榜(内地榜)
     "16": 香港电台中文歌曲龙虎榜,
     "17": 华语金曲榜,
     "18": 中国嘻哈榜,
     "19": 法国 NRJ EuroHot 30周榜,
     "20": 台湾Hito排行榜,
     "21": Beatport全球电子舞曲榜
   * */
}

export const RecommendList = API_ROOT.concat(apiMusic.recommendList);
export const RecommendMv = API_ROOT.concat(apiMusic.recommendMv);
export const RxclusivePush = API_ROOT.concat(apiMusic.exclusivePush);
export const FineSong = API_ROOT.concat(apiMusic.fineSong);
export const SongDetails = API_ROOT.concat(apiMusic.songDetails);
export const MusicDetails = API_ROOT.concat(apiMusic.musicDetails);
export const MusicUrl = API_ROOT.concat(apiMusic.musicUrl);
export const SearchMusic = API_ROOT.concat(apiMusic.searchMusic);
export const LyricsMusic = API_ROOT.concat(apiMusic.lyricsMusic);
export const MusicComment = API_ROOT.concat(apiMusic.musicComment);
export const SongComment = API_ROOT.concat(apiMusic.songComment);
export const BannerUrl = API_ROOT.concat(apiMusic.bannerUrl);
export const MusicAlbum = API_ROOT.concat(apiMusic.musicAlbum);
export const ArtistSinger = API_ROOT.concat(apiMusic.artistSinger);
export const ArtistMv = API_ROOT.concat(apiMusic.artistMv);
export const ArtistAlbum = API_ROOT.concat(apiMusic.artistAlbum);
export const MusicMv = API_ROOT.concat(apiMusic.musicMv);
export const ArtistDescribe = API_ROOT.concat(apiMusic.artistDescribe);
export const RankingList = API_ROOT.concat(apiMusic.rankingList);

