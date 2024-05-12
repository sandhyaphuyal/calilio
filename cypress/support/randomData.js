class RandomDataGen {
    generateRandomMobileNumber() {
      const randomPart = Math.floor(10000000 + Math.random() * 90000000);
      const mobileNumber = "98" + randomPart;
      return mobileNumber;
    }
  
    generateRandomYopmail() {
      const baseUsername = "gump";
      const randomString = Math.random().toString(36).substring(2, 8);
      const yopmailAddress = `${baseUsername}${randomString}@yopmail.com`;
      return yopmailAddress;
    }
  
    generateRandomFullName() {
      const firstNames = [
        "Raj",
        "John",
        "Emily",
        "Alex",
        "Sarah",
        "Michael",
        "Ava",
        "David",
        "Sophia",
        "Pradeep",
      ];
      const middleNames = [
        "Tumar",
        "William",
        "Grace",
        "James",
        "Elizabeth",
        "Daniel",
        "Olivia",
        "Matthew",
        "Lily",
      ];
      const lastNames = [
        "Khanal",
        "Smith",
        "Johnson",
        "Brown",
        "Lee",
        "Patel",
        "Garcia",
        "Nguyen",
        "Jones",
      ];
  
      const randomFirstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomMiddleName =
        middleNames[Math.floor(Math.random() * middleNames.length)];
      const randomLastName =
        lastNames[Math.floor(Math.random() * lastNames.length)];
  
      return `${randomFirstName} ${randomMiddleName} ${randomLastName}`;
    }
  
    generateRandomCompanyName() {
      const prefixes = [
        "Four",
        "Innovative",
        "Symmetrons",
        "Global",
        "Quantum",
        "Tech",
        "Digital",
        "Dynamic",
      ];
      const midfixes = [
        "Advanced",
        "Creative",
        "Strategic",
        "Infinite",
        "Unified",
        "Precision",
        "Epic",
      ];
      const suffixes = [
        "Solutions",
        "Technologies",
        "Innovations",
        "Ventures",
        "Enterprises",
        "Labs",
        "Corp.",
        "Ltd.",
      ];
  
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randomMidfix = midfixes[Math.floor(Math.random() * midfixes.length)];
      const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
      return `${randomPrefix} ${randomMidfix} ${randomSuffix}`;
    }
  
    generateFirstName(){
      const firstNames = [
          "Raj",
          "John",
          "Emily",
          "Alex",
          "Sarah",
          "Michael",
          "Ava",
          "David",
          "Sophia",
          "Pradeep",
        ];
        const middleNames = [
          "Tumar",
          "William",
          "Grace",
          "James",
          "Elizabeth",
          "Daniel",
          "Olivia",
          "Matthew",
          "Lily",
        ];
      const randomFirstName =firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomMiddleName =middleNames[Math.floor(Math.random() * middleNames.length)];
  
      return `${randomFirstName} ${randomMiddleName}`;
  
    }
    generateLastName(){
      const lastNames = [
          "Khanal",
          "Smith",
          "Johnson",
          "Brown",
          "Lee",
          "Patel",
          "Garcia",
          "Nguyen",
          "Jones",
        ];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
      return `${randomLastName}`;
  
    }
     generateRandomJobTitle() {
      const jobTitles = [
        "Software Developer",
        "Data Analyst",
        "Marketing Specialist",
        "Project Manager",
        "Graphic Designer",
        "Accountant",
        "Human Resources Manager",
        "Sales Representative",
        "Customer Service Representative",
        "Product Manager",
      ];
      const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      return `${jobTitle}`;
    }
  
  
  
  }
  export default RandomDataGen;
  