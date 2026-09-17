export interface ContactInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  resumeUrl: string;
  socialLinks: {
    linkedin: string;
    github: string;
    leetcode: string;
  };
}

export const contactInfo: ContactInfo = {
  name: 'Ahmed Salah',
  title: 'Full Stack Software Engineer',
  phone: '+20 1121097405',
  email: 'ahmedsalahabdellatif@gmail.com',
  location: '15th of May City Cairo, Egypt',
  resumeUrl:
    'https://drive.google.com/file/d/1N-J16liJyBO3N4gKTGaxTSpsN0a-pk-L/view',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/ahmedsalah121',
    github: 'https://github.com/AhmedSalah121',
    leetcode: 'https://leetcode.com/u/AhmedSalah121',
  },
};

export const aboutText =
  'Passionate Backend Software Engineer who is taking a big footstep into being a Fullstack Software Engineer. Always eager to take on new challenges.';

export const educationText =
  'Graduated from Faculty of Science - Computer Science Department January - 2025';
