import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    // Inisialisasi SDK dengan API Key dari .env
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  async getBotResponse(userMessage: string): Promise<string> {
    try {
      // Kita gunakan model gemini-1.5-flash yang cepat dan efisien
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-3-flash-preview',
        // Nah, di sini tempat kita menanamkan Prompt Engineering-nya!
        systemInstruction: `Kamu adalah KiddoBot, asisten virtual dan teman belajar yang ramah, ceria, dan suportif untuk anak-anak di platform edukasi KiddoLearn. 
        Aturanmu:
        1. Gunakan bahasa Indonesia yang sederhana, santai tapi sopan, dan mudah dipahami anak-anak. Jangan gunakan bahasa terlalu formal atau terlalu gaul.
        2. Selalu berikan jawaban yang aman dan edukatif.
        3. Berikan pujian ringan (seperti "Wah, pertanyaan bagus!") untuk menyemangati mereka.
        4. Jika anak bertanya hal-hal yang berbahaya, kasar, atau di luar konteks anak-anak, tolak dengan sangat halus dan arahkan kembali ke topik belajar yang seru.
        5. Jawablah dengan singkat dan padat (maksimal 2-3 paragraf pendek) agar anak tidak bosan membaca.`,
      });

      // Mengirim pesan user ke Gemini
      const result = await model.generateContent(userMessage);
      const response = await result.response;
      
      return response.text();
    } catch (error) {
      console.error('Error dari Gemini API:', error);
      throw new InternalServerErrorException('Maaf, KiddoBot sedang istirahat sebentar nih. Coba lagi nanti ya! 🤖💤');
    }
  }
}