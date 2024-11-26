<template>
  <div class="user-auth">
    <div class="user-auth-box col">
      <div class="header">
        <div class="logo">
          <img
            src="https://res.cloudinary.com/drayixmpk/image/upload/v1731331390/cics-logo_dmrh8v.png"
            alt="ust-cics-logo"
          />
        </div>
        <p>UST-CICS</p>
        <small>Capstone Directory</small>
      </div>
      <form class="col-10">
        <InputText class="input-user-auth" placeholder="Email" />
        <Password
          class="input-user-auth"
          :feedback="false"
          toggleMask
          placeholder="Password"
        />
        <Button label="LOGIN" />
        <RouterLink to="/forgot-password"
          ><small>Forgot Password?</small></RouterLink
        >
      </form>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
