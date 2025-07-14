import React from 'react';

export default function ContactInfoItem({ icon: Icon, title, content, link, imgSrc }) {
  const ContentWrapper = link ? 'a' : 'div';
  const props = link ? { href: link } : {};

  return (
    <ContentWrapper
      {...props}
      className={`flex items-start ${link ? 'hover:text-blue-600 transition-colors' : ''}`}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
        {imgSrc ? (
          <img src={imgSrc} alt={title} className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-gray-600 break-words">{content}</p>
      </div>
    </ContentWrapper>
  );
}

