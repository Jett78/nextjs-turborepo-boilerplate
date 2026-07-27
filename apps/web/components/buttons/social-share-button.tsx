"use client";

import Image from "next/image";

const SocialShare = ({ slug, title }: { slug: string; title: string }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${slug}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedURL = encodeURIComponent(shareUrl);

  const socialLinks = {
    FACEBOOK: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}&quote=${encodedTitle}`,
    TWITTER: `https://twitter.com/intent/tweet?url=${encodedURL}&text=${encodedTitle}`,
    WHATSAPP: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedURL}`,
  };

  const openSocialShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        name="share-on-facebook"
        onClick={() => openSocialShare(socialLinks.FACEBOOK)}
        aria-label="Share on Facebook"
        className="p-2 rounded-full hover:bg-muted transition-colors"
      >
        <Image
          src="/icons/facebook.png"
          width={24}
          height={24}
          alt="Facebook"
          className="h-6 w-6 cursor-pointer transition-transform duration-300 hover:scale-110"
        />
      </button>

      <button
        name="share-on-twitter"
        onClick={() => openSocialShare(socialLinks.TWITTER)}
        aria-label="Share on Twitter"
        className="p-2 rounded-full hover:bg-muted transition-colors"
      >
        <Image
          src="/icons/twitter.png"
          width={24}
          height={24}
          alt="Twitter"
          className="h-6 w-6 cursor-pointer transition-transform duration-300 hover:scale-110"
        />
      </button>

      <button
        name="share-on-whatsapp"
        onClick={() => openSocialShare(socialLinks.WHATSAPP)}
        aria-label="Share on WhatsApp"
        className="p-2 rounded-full hover:bg-muted transition-colors"
      >
        <Image
          src="/icons/whatsapp.png"
          width={24}
          height={24}
          alt="WhatsApp"
          className="h-6 w-6 cursor-pointer transition-transform duration-300 hover:scale-110"
        />
      </button>
    </div>
  );
};

export default SocialShare;
