module.exports = {
    async rewrites() {
      return [
        {
          source: "/:path*",
          destination: "/index.html",
        },
      ];
    },
  };
  