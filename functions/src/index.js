const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const XLSX = require('xlsx');

admin.initializeApp();

// Cloud Function to check student result
exports.checkResult = functions.https.onRequest(async (req, res) => {
  const ticketNumber = req.query.ticketNumber; // Get ticket number from query parameters

  if (!ticketNumber) {
    return res.status(400).send('Ticket number is required');
  }

  try {
    // Fetch the Excel file from Netlify
    const response = await axios.get('https://your-project-name.netlify.app/result.xlsx', { responseType: 'arraybuffer' });

    // Parse the Excel file using XLSX library
    const workbook = XLSX.read(response.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
    const sheet = workbook.Sheets[sheetName];
    const studentsData = XLSX.utils.sheet_to_json(sheet);

    // Find student data by ticket number
    const student = studentsData.find(student => student['Ticket Number'] === ticketNumber);

    if (student) {
      const result = student['Result'] === 'Qualified' ? 'Qualified' : 'Not Qualified';
      const marks = student['Marks'];
      return res.json({ result, marks });
    } else {
      return res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return res.status(500).send('Error fetching data');
  }
});
