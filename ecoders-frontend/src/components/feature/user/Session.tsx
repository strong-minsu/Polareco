import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store/store';
import axios from 'axios';
import { login, logout } from '../../../redux/slice/loginSlice';
import { setEmail, setId, setUsername, setProfileImg } from '../../../redux/slice/userSlice';
import { googlelogin, googlelogout } from '../../../redux/slice/googleSlice';
import { RootState } from '../../../redux/store/store';

//vite로 만든 프로젝트에서 환경변수 사용하기
const APIURL = import.meta.env.VITE_API_URL;

export async function tokenExpirationHandler(fun: Function) {
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    // refreshToken으로 accessToken 재발급 시도
    console.log(refreshToken);
    const response = await axios.post(`${APIURL}/token/reissue`, null, {
      headers: {
        'Refresh-Token': `${refreshToken}`,
      },
    });

    console.log(response);
    //refreshToken이 유효한 상태 accessToken 재등록
    if (response.status === 200) {
      //accessToken 재등록
      const newAccessToken = response.data['accessToken'];
      const newRefreshToken = response.data['refreshToken'];
      localStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      console.log(response.data);
      console.log(localStorage.getItem('accessToken'));
      console.log(localStorage.getItem('refreshToken'));
      // accessToken 재등록 후 callBack 함수 호출
      fun();
      return;
    }
  } catch (err: any) {
    //refreshToken도 만료됨
    console.log(err);
    if (err.response.status == 403) {
      // 로컬 스토리지 토큰들 삭제
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      alert('로그인 후 시도해주세요');
      //로그아웃
      // dispatch(logout());
      // setIsLoading(false);
      window.location.reload();
    } else {
      console.log(err);
    }
  }
}

function Session() {
  const dispatch = useDispatch();
  const email = useSelector((state: RootState) => state.user.email);
  //로그인 상태 받아옴
  //유저 정보 받아오는 함수
  async function getUser() {
    const accessToken = localStorage.getItem('accessToken');

    console.log(accessToken);
    try {
      // setIsLoading(true);
      const response = await axios.get(`${APIURL}/member/my-info`, {
        headers: {
          Authorization: accessToken,
          //ngrok 사용시에만 넣음
          // 'ngrok-skip-browser-warning': 'skip-browser-warning',
        },
      });
      // accessToken으로 유저 정보 불러오기 성공 (user 정보 저장)
      if (response.status === 200) {
        //get한 정보 userSlice 저장
        dispatch(setUsername(response.data.username));
        dispatch(setEmail(response.data.email));
        dispatch(setId(response.data.uuid));
        //이미지 있는 경우만 불러옴
        if (response.data.profileImage) {
          dispatch(setProfileImg(response.data.profileImage));
        }
        console.log('User information has been received successfully.');
        dispatch(login());
      }
    } catch (err: any) {
      //accessToken 만료일 경우
      if (err.response.status === 403) {
        console.log('session');
        tokenExpirationHandler(getUser);
      } else {
        dispatch(logout());
      }
    }
  }

  async function getUserGoogle() {
    const accessToken = localStorage.getItem('accessToken');
    try {
      // setIsLoading(true);
      const response = await axios.get(`${APIURL}/check/google`, {
        params: {
          email: email,
        },
        headers: {
          Authorization: accessToken,
        },
      });
      // accessToken으로 유저 정보 불러오기 성공 (user 정보 저장)
      if (response.status === 200) {
        //이미지 있는 경우만 불러옴
        console.log(response);
        console.log(response.data);
        if (response.data.googleMember) {
          dispatch(googlelogin());
        }
        console.log('User information has been received successfully.');
      }
    } catch (err: any) {
      //accessToken 만료일 경우
      if (err.response.status === 403) {
        console.log('GoogleLoginCheck Error');
        tokenExpirationHandler(getUserGoogle);
      } else {
        dispatch(googlelogout());
      }
    }
  }
  useEffect(() => {
    //토큰 유무로 로그인 상태 저장
    if (localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
      getUser();
      getUserGoogle();
    } else {
      dispatch(logout());
      dispatch(googlelogout());
      // setIsLoading(false);
    }
  });

  return <></>;
}
export default Session;
