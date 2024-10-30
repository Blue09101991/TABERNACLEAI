'use client';
// Chakra imports
import { Box } from '@chakra-ui/react';
import tableDataCheck from '@/components/tables/variables/tableDataCheck';
import CheckTable from '@/components/tables/CheckTable';
import { collection, doc, getDocs, query, where, getDoc, DocumentData } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase';
import { useEffect, useState } from 'react';
import { title } from 'process';


const countWords = (str: { split: (arg0: string) => { (): any; new(): any; filter: { (arg0: (n: any) => boolean): { (): any; new(): any; length: any; }; new(): any; }; }; }) => {
  return str.split(' ').filter((n) => n !== '').length;
};

const EssaysComponent = () => {

  interface DataItem {
    id: string;
    url: string;
    template: string;
    prompt: string;
    words: number;
    date: string;
    edit: string;
  }

  const [data, setData] = useState<DataItem[]>([]);

  const formatDate = (date: { toLocaleString: (arg0: string, arg1: { year: string; month: string; day: string; hour: string; minute: string; second: string; }) => any; }) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  useEffect(() => {
    const fetchNewTemplates = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !user.email) {
          console.error('No authenticated user found');
          return;
        }

        const userEmail = user.email;
        // This is a reference to the 'newtemplate' collection for the user
        const newTemplateCollectionRef = collection(firestore, 'myproject', userEmail, 'newtemplate');

        const querySnapshot = await getDocs(newTemplateCollectionRef);
        const titles: any[] = [];
        querySnapshot.forEach((doc) => {
          // Extract the title for each document and add it to the titles array
          const docData = doc.data();
          if (docData && docData.title) {
            titles.push(docData.title);
          }
        });
        console.log("Titles:", titles);
      } catch (error) {
        console.error("Error fetching new templates data:", error);
      }
    };

    fetchNewTemplates();
  }, []);

  const fetchNewTemplatesTitles = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        console.error('No authenticated user found');
        return;
      }

      const userEmail = user.email;
      // Reference to the 'newtemplate' collection for the user
      const newTemplateCollectionRef = collection(firestore, 'myproject', userEmail, 'newtemplate');

      const querySnapshot = await getDocs(newTemplateCollectionRef);
      const titles = querySnapshot.docs.map((doc) => {
        const docData = doc.data();
        return docData.title; // Assuming the title is a direct property
      });

      console.log("Titles:", titles);
      return titles; // Return the array of titles
    } catch (error) {
      console.error("Error fetching new templates titles:", error);
    }
  };




  useEffect(() => {

    const fetchCombinedData = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !user.email) {
          throw new Error('No authenticated user found');
        }


        // Fetch essays
        const essaysCollectionRef = collection(firestore, 'history', user.email, 'essays');
        const essaysQuery = query(essaysCollectionRef, where('created', '!=', null));
        const essaysSnapshot = await getDocs(essaysQuery);
        const essaysData = essaysSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: "essay",
            template: '📝 Write an Essay',
            prompt: data.topic || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch simplifiers
        const simplifiersCollectionRef = collection(firestore, 'history', user.email, 'simplifier');
        const simplifiersQuery = query(simplifiersCollectionRef, where('created', '!=', null));
        const simplifiersSnapshot = await getDocs(simplifiersQuery);
        const simplifiersData = simplifiersSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'simplifier',
            template: '👶 Content Simplifier',
            prompt: data.content || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch productDescription
        const productDescriptionCollectionRef = collection(firestore, 'history', user.email, 'productDescription');
        const productDescriptionQuery = query(productDescriptionCollectionRef, where('created', '!=', null));
        const productDescriptionSnapshot = await getDocs(productDescriptionQuery);
        const productDescriptionData = productDescriptionSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'product-description',
            template: '🎯 Product Description',
            prompt: data.name || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch emailEnhancer
        const emailEnhancerCollectionRef = collection(firestore, 'history', user.email, 'emailEnhancer');
        const emailEnhancerQuery = query(emailEnhancerCollectionRef, where('created', '!=', null));
        const emailEnhancerSnapshot = await getDocs(emailEnhancerQuery);
        const emailEnhancerData = emailEnhancerSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'email-enhancer',
            template: '📧 Email Enhancer',
            prompt: data.topic || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch linkedinMessage
        const linkedinMessageCollectionRef = collection(firestore, 'history', user.email, 'linkedinMessage');
        const linkedinMessageQuery = query(linkedinMessageCollectionRef, where('created', '!=', null));
        const linkedinMessageSnapshot = await getDocs(linkedinMessageQuery);
        const linkedinMessageData = linkedinMessageSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'linkedin-message',
            template: '💬 LinkedIn Message',
            prompt: data.topic || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch instagramCaption
        const instagramCaptionCollectionRef = collection(firestore, 'history', user.email, 'caption');
        const instagramCaptionQuery = query(instagramCaptionCollectionRef, where('created', '!=', null));
        const instagramCaptionSnapshot = await getDocs(instagramCaptionQuery);
        const instagramCaptionData = instagramCaptionSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'caption',
            template: '🌄 Instagram Caption',
            prompt: data.topic || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch faq
        const faqCollectionRef = collection(firestore, 'history', user.email, 'faq');
        const faqQuery = query(faqCollectionRef, where('created', '!=', null));
        const faqSnapshot = await getDocs(faqQuery);
        const faqData = faqSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'faq',
            template: '❓ FAQs Content',
            prompt: data.topic || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch namegenerator
        const nameGeneratorCollectionRef = collection(firestore, 'history', user.email, 'namegenerator');
        const nameGeneratorQuery = query(nameGeneratorCollectionRef, where('created', '!=', null));
        const nameGeneratorSnapshot = await getDocs(nameGeneratorQuery);
        const nameGeneratorData = nameGeneratorSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'name-generator',
            template: '🏷️ Product Name Generator',
            prompt: data.topic || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch seo
        const seoCollectionRef = collection(firestore, 'history', user.email, 'seokeywords');
        const seoQuery = query(seoCollectionRef, where('created', '!=', null));
        const seoSnapshot = await getDocs(seoQuery);
        const seoData = seoSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'seo-keywords',
            template: '📈 SEO Keywords',
            prompt: data.topic || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch review
        const reviewCollectionRef = collection(firestore, 'history', user.email, 'reviewresponder');
        const reviewQuery = query(reviewCollectionRef, where('created', '!=', null));
        const reviewSnapshot = await getDocs(reviewQuery);
        const reviewData = reviewSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'review-responder',
            template: '🌟 Review Responder',
            prompt: data.topic || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(
              data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch business
        const businessCollectionRef = collection(firestore, 'history', user.email, 'businessgenerator');
        const businessQuery = query(businessCollectionRef, where('created', '!=', null));
        const businessSnapshot = await getDocs(businessQuery);
        const businessData = businessSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'business-generator',
            template: '💡 Business Idea Generator',
            prompt: data.topic || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch article
        const articleCollectionRef = collection(firestore, 'history', user.email, 'articlegenerator');
        const articleQuery = query(articleCollectionRef, where('created', '!=', null));
        const articleSnapshot = await getDocs(articleQuery);
        const articlesData = articleSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'article',
            template: '📄 Article Generator',
            prompt: data.topic || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch plagiarismchecker
        const plagiarismCollectionRef = collection(firestore, 'history', user.email, 'plagiarismchecker');
        const plagiarismQuery = query(plagiarismCollectionRef, where('created', '!=', null));
        const plagiarismSnapshot = await getDocs(plagiarismQuery);
        const plagiarismData = plagiarismSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'plagiarism-checker',
            template: '©️ Plagiarism Checker',
            prompt: data.content || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch hashtagsgenerator
        const hashtagsCollectionRef = collection(firestore, 'history', user.email, 'hashtagsgenerator');
        const hashtagsQuery = query(hashtagsCollectionRef, where('created', '!=', null));
        const hashtagsSnapshot = await getDocs(hashtagsQuery);
        const hashtagsData = hashtagsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'hashtags-generator',
            template: '#️⃣ Hashtags Generator',
            prompt: data.content || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch petnamegenerator
        const petnameCollectionRef = collection(firestore, 'history', user.email, 'petnamegenerator');
        const petnameQuery = query(petnameCollectionRef, where('created', '!=', null));
        const petnameSnapshot = await getDocs(petnameQuery);
        const petnameData = petnameSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'pet-name-generator',
            template: '🐶 Pet Name Generator',
            prompt: data.type || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch domainnamegenerator
        const domainCollectionRef = collection(firestore, 'history', user.email, 'domainnamegenerator');
        const domainQuery = query(domainCollectionRef, where('created', '!=', null));
        const domainSnapshot = await getDocs(domainQuery);
        const domainData = domainSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            url: 'domain-name-generator',
            template: '🔗 Domain Name Generator',
            prompt: data.keywords || '',
            words: countWords(data.outputCode || ''),
            date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()), // Format the date here
            edit: 'false',
          };
        });

        // Fetch titles for new templates
        const newTemplateTitles = await fetchNewTemplatesTitles() || [];

        let newTemplateData: any[] = [];

        for (const title of newTemplateTitles) {
          const templateCollectionRef = collection(firestore, 'createdtemplate', user.email, title);
          const templateQuery = query(templateCollectionRef, where('created', '!=', null));
          const templateSnapshot = await getDocs(templateQuery);

          const templateData = templateSnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("title:", data.emoji)
            return {
              id: doc.id,
              url: 'created-template',
              title: title,
              template: `${data.emoji || ''} ${title}`,
              prompt: data.content || '',
              words: countWords(data.outputCode || ''),
              date: data.created ? formatDate(data.created.toDate()) : formatDate(new Date()),
              edit: 'false',
            };
          });

          newTemplateData = [...newTemplateData, ...templateData];
        }

        // Combine and sort by date
        const combinedData = [...essaysData, ...simplifiersData, ...productDescriptionData, ...emailEnhancerData, ...linkedinMessageData, ...instagramCaptionData,
        ...faqData, ...nameGeneratorData, ...seoData, ...reviewData, ...businessData, ...articlesData, ...plagiarismData, ...hashtagsData,
        ...petnameData, ...domainData, ...newTemplateData];
        // combinedData.sort((a, b) => b.date.localeCompare(a.date));
        combinedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


        setData(combinedData);
        console.log('Formatted data:', combinedData);
      } catch (error) {
        console.error('Error fetching combined data:', error);
      }
    };

    fetchCombinedData();
  }, []);





  // Chakra Color Mode
  return (
    <Box mt={{ base: '70px', md: '0px', xl: '0px' }}>
      <CheckTable tableData={data} />
    </Box>
  );
}

export default EssaysComponent;
