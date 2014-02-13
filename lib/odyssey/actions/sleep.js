
function Sleep(ms) {

  return Action({

    enter: function() {
      setTimeout(this.finish, ms);
      return true;
    }

  });
}

