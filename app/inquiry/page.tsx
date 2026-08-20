import type { Metadata } from 'next'
import InquiryForm from '@/components/ui/InquiryForm'

export const metadata: Metadata = {
  title: '기관 주문·문의 | ICANMEAL',
  description: '우리 기관에 맞는 맞춤 제안을 받아보세요 — 참여 인원, 희망 일정을 알려주시면 담당 매니저가 1~2일 내 연락드립니다.',
}

export default function InquiryPage() {
  return <InquiryForm />
}
