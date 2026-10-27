export default function Footer() {
  return (
    <footer className="mt-24 rule-t">
      <div className="wrap py-8">
        <div className="flex w-[171px] flex-col items-end">
          <div className="flex items-center gap-2">
            <img src="/logos-fonts/footer%20logo.png" alt="" aria-hidden="true" className="h-10 w-10 object-contain" />
            <img src="/logos-fonts/line%2001%20-%20Copy.png" alt="tape_x247" className="h-auto w-[123px]" />
          </div>
          <p className="kicker mt-2 w-max whitespace-nowrap text-right text-sm tracking-[0.2em]">records on 24/7</p>
        </div>
      </div>
    </footer>
  );
}
