import axios from "axios";

const API_URL = "http://localhost:5000";

class AuthService {
  login(user_name, api_key) {
    return axios
      .post(API_URL + "/login", {
        user_name,
        api_key
      })
      .then(response => {
        if (response.data.token.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(user_name, email, api_key) {
    return axios.post(API_URL + "signup", {
      user_name,
      email,
      api_key
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
