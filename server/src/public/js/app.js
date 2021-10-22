const API_ENDPOINT = "/api/v1";

const register = () => {
  $.ajax({
    url: `${API_ENDPOINT}/auth/register`,
    method: "POST",
    contentType: "application/json",
    data: {
      name: "uuu",
      username: "aaaa",
      password: "12345",
    },
  });
};

const login = () => {
  $.ajax({
    url: `${API_ENDPOINT}/auth/login`,
    method: "POST",
    contentType: "application/json",
    data: {
      username: "aaaa",
      password: "12345",
    },
  });
};
