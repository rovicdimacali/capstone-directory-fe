<template>
  <div class="terms-of-use">
    <Button
      severity="secondary"
      label="Go Back"
      @click="this.$router.push('/login')"
      icon="pi pi-chevron-left"
    />
    <h1>Terms of Use</h1>
    <p>
      Welcome to the CICS Capstone and Thesis Project Directory. By accessing
      and using this website, you agree to comply with the following terms and
      conditions. Please read these terms carefully before using the platform.
      If you do not agree with these terms, you must refrain from using the
      website.
    </p>

    <h2>1. Acceptance of Terms</h2>
    <p>
      By accessing or using the CICS Capstone and Thesis Project Directory (the
      "Site"), you acknowledge that you have read, understood, and agreed to be
      bound by these Terms of Use, as well as our Privacy Policy. These terms
      apply to all users of the site, including faculty, students, and
      administrative staff.
    </p>

    <h2>2. User Accounts and Access</h2>
    <ul>
      <li>
        <strong>Eligibility:</strong> Only registered members of the University
        of Santo Tomas College of Information and Computing Sciences (UST CICS),
        including faculty, students, and department chairs, are eligible to
        create an account and access the platform.
      </li>
      <li>
        <strong>Account Security:</strong> Each user is responsible for
        maintaining the confidentiality of their login credentials. You agree to
        notify the administrator immediately if there is any unauthorized use of
        your account.
      </li>
      <li>
        <strong>Role-Based Access:</strong> Access to project files and features
        is determined by user roles:
        <ul>
          <li>
            <strong>Students:</strong> Can submit and view approved capstone and
            thesis project information.
          </li>
          <li>
            <strong>Faculty:</strong> Can review, approve, and provide feedback
            on project submissions.
          </li>
          <li>
            <strong>Department Chairs:</strong> Have administrative rights to
            manage project submissions and approve final projects.
          </li>
        </ul>
      </li>
    </ul>

    <h2>3. Usage Guidelines</h2>
    <ul>
      <li>
        <strong>Academic Integrity:</strong> All users are expected to maintain
        academic integrity while using the platform. Any attempt to plagiarize,
        alter, or misuse capstone or thesis projects will result in disciplinary
        action as per the university’s academic code of conduct.
      </li>
      <li>
        <strong>File Submissions:</strong> All project submissions must comply
        with the university's formatting and file requirements. Users are
        responsible for ensuring that the files submitted are accurate and free
        from any errors.
      </li>
      <li>
        <strong>Prohibited Activities:</strong> Users are strictly prohibited
        from:
        <ul>
          <li>
            Uploading or sharing malicious software, viruses, or any harmful
            content.
          </li>
          <li>
            Attempting to hack, disrupt, or interfere with the website’s
            operation.
          </li>
          <li>
            Sharing confidential information or project files outside the
            permitted roles and access levels.
          </li>
        </ul>
      </li>
    </ul>

    <h2>4. Intellectual Property</h2>
    <ul>
      <li>
        <strong>Ownership:</strong> All content uploaded by students, including
        capstone projects, thesis papers, and related materials, remains the
        intellectual property of the respective authors.
      </li>
      <li>
        <strong>License:</strong> By submitting projects to the platform,
        students grant the UST CICS the non-exclusive right to store, display,
        and share these files within the university for academic and research
        purposes.
      </li>
    </ul>

    <h2>5. Data Security and Privacy</h2>
    <ul>
      <li>
        <strong>Personal Information:</strong> We are committed to protecting
        your privacy. Any personal information collected during account
        registration will be used in accordance with our Privacy Policy. The
        university will not share or sell personal information to third parties.
      </li>
      <li>
        <strong>Data Protection:</strong> We implement appropriate security
        measures to protect your data. However, no method of transmission over
        the internet is completely secure. By using the platform, you
        acknowledge and accept any associated risks.
      </li>
    </ul>

    <h2>6. Limitation of Liability</h2>
    <p>
      The CICS Capstone and Thesis Project Directory is provided "as is." The
      UST CICS makes no guarantees regarding the accuracy, reliability, or
      availability of the platform at all times. We will not be liable for any
      indirect, incidental, or consequential damages resulting from the use of
      the platform, including data loss or downtime.
    </p>

    <h2>7. Amendments to the Terms</h2>
    <p>
      The UST CICS reserves the right to modify or update these Terms of Use at
      any time. Any changes will be communicated via email or posted on the
      platform. Continued use of the platform after modifications constitutes
      acceptance of the revised terms.
    </p>

    <h2>8. Termination</h2>
    <p>
      We reserve the right to terminate or suspend user accounts without notice
      if any of these terms are violated or if we believe your use of the
      platform poses a security risk to the site or its users.
    </p>

    <h2>9. Governing Law</h2>
    <p>
      These Terms of Use shall be governed by and construed in accordance with
      the laws of the Republic of the Philippines. Any disputes arising from
      these terms will be subject to the exclusive jurisdiction of the courts in
      Manila.
    </p>

    <h2>10. Contact Information</h2>
    <p>
      For questions or concerns regarding these Terms of Use, please contact the
      system administrator at
      <a href="mailto:cics@ust.edu.ph">cics@ust.edu.ph</a>.
    </p>
  </div>
</template>

<style scoped>
.terms-of-use {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 20px;
  color: #333;
  max-width: 1200px;
  margin: 50px auto;
}
h1,
h2 {
  color: black;
}
h1 {
  margin-bottom: 10px;
}
h2 {
  margin-top: 20px;
}
p,
ul {
  margin: 10px 0;
}
ul {
  padding-left: 20px;
  list-style-type: disc;
}

a {
  text-decoration: underline;
  color: blue;
}
</style>
